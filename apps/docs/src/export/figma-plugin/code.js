// Design System Builder -> Figma importer
//
// `TOKENS` is injected above this file at export time:
// { modes: ['Light', 'Dark'], variables: [{ name, type: 'COLOR' | 'FLOAT', values: [light, dark] }] }
//
// Run order:
// 1. Variables: "Design Tokens" collection with Light / Dark modes (updated in place by name)
// 2. Styles: Text/{step} text styles and Shadow/{level} effect styles (updated in place by name)
// 3. Components page: built once. If the page already exists it is left alone so existing
//    instances stay linked; token changes still flow in through the variables.
//
// Plain ES2017 on purpose (no ?. / ?? / object spread) so it runs in every Figma sandbox.

var COLLECTION_NAME = 'Design Tokens';
var PAGE_NAME = 'Design Tokens · Components';
var FONT_FAMILY = 'Inter';
var COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
var SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
var TEXT_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
var SHADOW_LEVELS = ['sm', 'md', 'lg', 'xl'];

var V = {}; // variable name -> Variable
var L = {}; // variable name -> light value (raw value before binding)
var collection = null;
var lightModeId = null;
var darkModeId = null;
var effectStyles = {}; // level -> EffectStyle

/* ---------- utils ---------- */

function rgb(hex) {
  var n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** brand colors live under color/brand, the rest under color/status */
function colorVar(color) {
  return 'color/' + (color === 'primary' || color === 'secondary' ? 'brand' : 'status') + '/' + color;
}

function styleForWeight(weight) {
  if (weight >= 700) return 'Bold';
  if (weight >= 600) return 'Semi Bold';
  if (weight >= 500) return 'Medium';
  return 'Regular';
}

/* ---------- variables ---------- */

var SCOPES = [
  [/^color\//, ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR']],
  [/^font\/size\//, ['FONT_SIZE']],
  [/^font\/line-height\//, ['LINE_HEIGHT']],
  [/^font\/weight\//, ['FONT_WEIGHT']],
  [/^radius\//, ['CORNER_RADIUS']],
  [/^border-width\//, ['STROKE_FLOAT']],
  [/^focus-ring\//, ['STROKE_FLOAT']],
  [/^space\//, ['GAP']],
  [/^size\/.*\/height$/, ['WIDTH_HEIGHT']],
  [/^size\/.*\/padding-x$/, ['GAP']],
  [/^shadow\/(sm|md|lg|xl)\//, ['EFFECT_FLOAT']],
];

async function setupVariables() {
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  collection = collections.find(function (c) {
    return c.name === COLLECTION_NAME;
  });
  if (!collection) collection = figma.variables.createVariableCollection(COLLECTION_NAME);

  lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, TOKENS.modes[0]);
  var dark = collection.modes.find(function (m) {
    return m.name === TOKENS.modes[1];
  });
  if (dark) {
    darkModeId = dark.modeId;
  } else {
    try {
      darkModeId = collection.addMode(TOKENS.modes[1]);
    } catch (e) {
      // Plans with a single mode per collection: keep light only
      darkModeId = null;
    }
  }

  var existing = {};
  var locals = await figma.variables.getLocalVariablesAsync();
  locals.forEach(function (v) {
    if (v.variableCollectionId === collection.id) existing[v.name] = v;
  });

  TOKENS.variables.forEach(function (def) {
    var v = existing[def.name];
    if (v && v.resolvedType !== def.type) {
      v.remove();
      v = null;
    }
    if (!v) v = figma.variables.createVariable(def.name, collection, def.type);

    var toValue = function (x) {
      if (def.type !== 'COLOR') return x;
      var c = rgb(x);
      return { r: c.r, g: c.g, b: c.b, a: 1 };
    };
    v.setValueForMode(lightModeId, toValue(def.values[0]));
    if (darkModeId) v.setValueForMode(darkModeId, toValue(def.values[1]));

    for (var i = 0; i < SCOPES.length; i++) {
      if (SCOPES[i][0].test(def.name)) {
        try {
          v.scopes = SCOPES[i][1];
        } catch (e) {}
        break;
      }
    }
    V[def.name] = v;
    L[def.name] = def.values[0];
  });
}

/* ---------- styles ---------- */

async function setupStyles() {
  var textStyles = await figma.getLocalTextStylesAsync();
  TEXT_STEPS.forEach(function (step) {
    var name = 'Text/' + step;
    var style = textStyles.find(function (s) {
      return s.name === name;
    });
    if (!style) {
      style = figma.createTextStyle();
      style.name = name;
    }
    style.fontName = { family: FONT_FAMILY, style: 'Regular' };
    style.fontSize = L['font/size/' + step];
    style.lineHeight = { unit: 'PIXELS', value: L['font/line-height/' + step] };
    bind(style, 'fontSize', 'font/size/' + step);
    bind(style, 'lineHeight', 'font/line-height/' + step);
  });

  var shadowColor = rgb(L['color/shadow']);
  var opacity = L['shadow/opacity'];
  var styles = await figma.getLocalEffectStylesAsync();
  SHADOW_LEVELS.forEach(function (level) {
    var name = 'Shadow/' + level;
    var style = styles.find(function (s) {
      return s.name === name;
    });
    if (!style) {
      style = figma.createEffectStyle();
      style.name = name;
    }
    var effect = {
      type: 'DROP_SHADOW',
      color: { r: shadowColor.r, g: shadowColor.g, b: shadowColor.b, a: opacity },
      offset: { x: 0, y: L['shadow/' + level + '/y'] },
      radius: L['shadow/' + level + '/blur'],
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    };
    try {
      effect = figma.variables.setBoundVariableForEffect(effect, 'offsetY', V['shadow/' + level + '/y']);
      effect = figma.variables.setBoundVariableForEffect(effect, 'radius', V['shadow/' + level + '/blur']);
    } catch (e) {}
    style.effects = [effect];
    effectStyles[level] = style;
  });
}

/* ---------- node helpers ---------- */

function bind(node, field, name) {
  var v = V[name];
  if (!v) return;
  try {
    node.setBoundVariable(field, v);
  } catch (e) {}
}

function solid(name, opacity) {
  var paint = { type: 'SOLID', color: rgb(L[name] || '#000000'), opacity: opacity == null ? 1 : opacity };
  if (V[name]) paint = figma.variables.setBoundVariableForPaint(paint, 'color', V[name]);
  return paint;
}

function fill(node, name, opacity) {
  node.fills = name ? [solid(name, opacity)] : [];
}

function stroke(node, name, widthName, opacity) {
  node.strokes = [solid(name, opacity)];
  node.strokeAlign = 'INSIDE';
  node.strokeWeight = L[widthName];
  bind(node, 'strokeWeight', widthName);
}

function radius(node, name) {
  node.cornerRadius = L[name];
  ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach(function (f) {
    bind(node, f, name);
  });
}

function padX(node, name) {
  node.paddingLeft = node.paddingRight = L[name];
  bind(node, 'paddingLeft', name);
  bind(node, 'paddingRight', name);
}

function padY(node, name) {
  node.paddingTop = node.paddingBottom = L[name];
  bind(node, 'paddingTop', name);
  bind(node, 'paddingBottom', name);
}

function gap(node, name) {
  node.itemSpacing = L[name];
  bind(node, 'itemSpacing', name);
}

/** Auto-layout frame (or component) that hugs its content */
function stack(node, direction) {
  node.layoutMode = direction;
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'AUTO';
  node.counterAxisAlignItems = 'CENTER';
  node.fills = [];
  return node;
}

function frame(name, direction) {
  var f = figma.createFrame();
  f.name = name;
  return stack(f, direction || 'HORIZONTAL');
}

function component(name, direction) {
  var c = figma.createComponent();
  c.name = name;
  return stack(c, direction || 'HORIZONTAL');
}

/** Fixed height bound to a size token; width still hugs */
function fixedHeight(node, name) {
  node.counterAxisSizingMode = 'FIXED';
  node.resize(Math.max(node.width, 1), L[name]);
  bind(node, 'height', name);
}

function text(chars, step, weight, color) {
  var t = figma.createText();
  t.fontName = { family: FONT_FAMILY, style: styleForWeight(L['font/weight/' + weight]) };
  t.characters = chars;
  t.fontSize = L['font/size/' + step];
  t.lineHeight = { unit: 'PIXELS', value: L['font/line-height/' + step] };
  bind(t, 'fontSize', 'font/size/' + step);
  bind(t, 'lineHeight', 'font/line-height/' + step);
  fill(t, color);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  return t;
}

var SHAPE_TYPES = ['VECTOR', 'ELLIPSE', 'RECTANGLE', 'LINE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION'];

/** SVG icon whose shapes are bound to a color variable (SVG circles import as ellipses, paths as vectors) */
function icon(svg, colorName, opacity) {
  var node = figma.createNodeFromSvg(svg);
  node.fills = [];
  node.findAll(function (n) {
    return SHAPE_TYPES.indexOf(n.type) >= 0;
  }).forEach(function (shape) {
    if (shape.strokes.length) shape.strokes = [solid(colorName, opacity)];
    if (shape.fills.length) shape.fills = [solid(colorName, opacity)];
  });
  return node;
}

/** Stroke-only 16px-grid icon at a given pixel size */
function svgIcon(paths, size) {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 16 16">' +
    '<path d="' + paths + '" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  );
}

var CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var CLOSE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" fill="none" stroke="#000" stroke-width="1.75" stroke-linecap="round"/></svg>';
var INFO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="none" stroke="#000" stroke-width="1.75"/><path d="M10 9v4.5M10 6.25v.25" fill="none" stroke="#000" stroke-width="1.75" stroke-linecap="round"/></svg>';

var ICON = {
  plus: 'M8 3v10M3 8h10',
  close: 'M4 4l8 8M12 4l-8 8',
  chevronDown: 'M4 6l4 4 4-4',
  chevronUp: 'M4 10l4-4 4 4',
  chevronLeft: 'M10 4L6 8l4 4',
  chevronRight: 'M6 4l4 4-4 4',
  check: 'M3.5 8.5l3 3 6-7',
  external: 'M6 4h6v6M12 4l-7 7',
  calendar: 'M3 4.5h10v8.5H3zM3 7h10M5.5 2.5v3M10.5 2.5v3',
  upload: 'M8 11V3M5 6l3-3 3 3M3 11v2h10v-2',
  folder: 'M2.5 4.5h4l1.5 1.5h5.5v6.5h-11z',
  file: 'M9.5 2.5H4.5v11h7v-9zM9.5 2.5v2h2',
};

async function applyShadow(node, level) {
  var style = effectStyles[level];
  if (!style) return;
  if (node.setEffectStyleIdAsync) await node.setEffectStyleIdAsync(style.id);
  else node.effectStyleId = style.id;
}

/* ---------- components ---------- */

function buildButtons() {
  var list = [];
  ['solid', 'soft', 'outline', 'ghost'].forEach(function (variant) {
    SIZES.forEach(function (size) {
      COLORS.forEach(function (color) {
        var c = component('Variant=' + cap(variant) + ', Size=' + size + ', Color=' + color);
        c.primaryAxisAlignItems = 'CENTER';
        var base = colorVar(color);
        var label = base;
        if (variant === 'solid') {
          fill(c, base);
          stroke(c, base, 'border-width/sm');
          label = base + '-foreground';
        } else if (variant === 'soft') {
          fill(c, base, 0.12);
        } else if (variant === 'outline') {
          stroke(c, base, 'border-width/sm');
        }
        c.appendChild(text('Button', size, 'semibold', label));
        padX(c, 'size/' + size + '/padding-x');
        fixedHeight(c, 'size/' + size + '/height');
        radius(c, 'radius/md');
        list.push(c);
      });
    });
  });
  return list;
}

function buildInputs() {
  var list = [];
  SIZES.forEach(function (size) {
    ['Default', 'Filled', 'Invalid', 'Disabled'].forEach(function (state) {
      var c = component('Size=' + size + ', State=' + state);
      fill(c, 'color/neutral/surface');
      stroke(c, state === 'Invalid' ? 'color/status/danger' : 'color/neutral/border', 'border-width/sm');
      radius(c, 'radius/md');
      padX(c, 'size/' + size + '/padding-x');
      var filled = state === 'Filled' || state === 'Invalid';
      var t = text(filled ? 'Value' : 'Placeholder', size, 'regular', filled ? 'color/neutral/text' : 'color/neutral/text-muted');
      c.appendChild(t);
      t.layoutGrow = 1;
      t.textAutoResize = 'HEIGHT';
      c.primaryAxisSizingMode = 'FIXED';
      c.counterAxisSizingMode = 'FIXED';
      c.resize(240, L['size/' + size + '/height']);
      bind(c, 'height', 'size/' + size + '/height');
      if (state === 'Disabled') c.opacity = 0.5;
      list.push(c);
    });
  });
  return list;
}

/** Checkbox / Radio share the box + label layout */
function choiceBox(kind, checked) {
  var box = frame('Control', 'HORIZONTAL');
  box.primaryAxisAlignItems = 'CENTER';
  box.primaryAxisSizingMode = 'FIXED';
  box.counterAxisSizingMode = 'FIXED';
  box.resize(18, 18);
  if (kind === 'radio') box.cornerRadius = 9;
  else radius(box, 'radius/sm');
  fill(box, checked ? 'color/brand/primary' : 'color/neutral/surface');
  stroke(box, checked ? 'color/brand/primary' : 'color/neutral/text', 'border-width/sm', checked ? 1 : 0.3);
  if (checked) {
    if (kind === 'radio') {
      var dot = figma.createEllipse();
      dot.resize(8, 8);
      dot.fills = [solid('color/brand/primary-foreground')];
      box.appendChild(dot);
    } else {
      box.appendChild(icon(CHECK_SVG, 'color/brand/primary-foreground'));
    }
  }
  return box;
}

function buildChoices(kind) {
  return ['Unchecked', 'Checked', 'Disabled'].map(function (state) {
    var c = component('State=' + state);
    gap(c, 'space/sm');
    c.appendChild(choiceBox(kind, state === 'Checked'));
    c.appendChild(text('Label', 'md', 'regular', 'color/neutral/text'));
    if (state === 'Disabled') c.opacity = 0.5;
    return c;
  });
}

async function buildSwitches() {
  var list = [];
  var states = ['Off', 'On', 'Disabled'];
  for (var i = 0; i < states.length; i++) {
    var state = states[i];
    var on = state === 'On';
    var c = component('State=' + state);
    gap(c, 'space/sm');
    var track = figma.createFrame();
    track.name = 'Track';
    track.resize(36, 20);
    track.cornerRadius = 10;
    fill(track, on ? 'color/brand/primary' : 'color/neutral/text', on ? 1 : 0.2);
    var thumb = figma.createEllipse();
    thumb.name = 'Thumb';
    thumb.resize(16, 16);
    thumb.x = on ? 18 : 2;
    thumb.y = 2;
    thumb.fills = on ? [solid('color/brand/primary-foreground')] : [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    track.appendChild(thumb);
    await applyShadow(thumb, 'sm');
    c.appendChild(track);
    c.appendChild(text('Label', 'md', 'regular', 'color/neutral/text'));
    if (state === 'Disabled') c.opacity = 0.5;
    list.push(c);
  }
  return list;
}

function buildBadges() {
  var list = [];
  ['solid', 'soft', 'outline'].forEach(function (variant) {
    ['sm', 'md'].forEach(function (size) {
      COLORS.forEach(function (color) {
        var c = component('Variant=' + cap(variant) + ', Size=' + size + ', Color=' + color);
        c.primaryAxisAlignItems = 'CENTER';
        var base = colorVar(color);
        if (variant === 'solid') fill(c, base);
        else if (variant === 'soft') fill(c, base, 0.14);
        else stroke(c, base, 'border-width/sm');
        c.appendChild(text(cap(color), size === 'sm' ? 'xs' : 'sm', 'semibold', variant === 'solid' ? base + '-foreground' : base));
        if (size === 'sm') c.paddingLeft = c.paddingRight = 6;
        else padX(c, 'space/sm');
        c.counterAxisSizingMode = 'FIXED';
        c.resize(Math.max(c.width, 1), size === 'sm' ? 20 : 24);
        radius(c, 'radius/sm');
        list.push(c);
      });
    });
  });
  return list;
}

function buildTags() {
  var list = [];
  ['neutral'].concat(COLORS).forEach(function (color) {
    [false, true].forEach(function (removable) {
      var c = component('Color=' + color + ', Removable=' + (removable ? 'Yes' : 'No'));
      gap(c, 'space/xs');
      padX(c, 'space/sm');
      radius(c, 'radius/md');
      var fg = color === 'neutral' ? 'color/neutral/text' : colorVar(color);
      if (color === 'neutral') {
        fill(c, 'color/neutral/surface');
        stroke(c, 'color/neutral/border', 'border-width/sm');
      } else {
        fill(c, colorVar(color), 0.14);
      }
      c.appendChild(text(color === 'neutral' ? 'Tag' : cap(color), 'sm', 'medium', fg));
      if (removable) c.appendChild(icon(CLOSE_SVG, fg));
      c.counterAxisSizingMode = 'FIXED';
      c.resize(Math.max(c.width, 1), 24);
      list.push(c);
    });
  });
  return list;
}

function textBlock(chars, step, weight, color) {
  var t = text(chars, step, weight, color);
  t.layoutAlign = 'STRETCH';
  t.textAutoResize = 'HEIGHT';
  return t;
}

function buttonInstance(buttons, variant, label) {
  var main = buttons.find(function (b) {
    return b.name === 'Variant=' + variant + ', Size=sm, Color=primary';
  });
  var inst = main.createInstance();
  var t = inst.findOne(function (n) {
    return n.type === 'TEXT';
  });
  if (t) t.characters = label;
  return inst;
}

async function buildCards(buttons) {
  var list = [];
  var variants = ['outline', 'elevated', 'filled'];
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var c = component('Variant=' + cap(variant), 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    gap(c, 'space/lg');
    padX(c, 'space/xl');
    padY(c, 'space/xl');
    radius(c, 'radius/lg');
    if (variant === 'filled') c.fills = [solid('color/neutral/surface'), solid('color/neutral/text', 0.04)];
    else fill(c, 'color/neutral/surface');
    if (variant === 'outline') stroke(c, 'color/neutral/border', 'border-width/sm');
    if (variant === 'elevated') await applyShadow(c, 'md');

    var header = frame('Header', 'VERTICAL');
    header.counterAxisAlignItems = 'MIN';
    header.layoutAlign = 'STRETCH';
    gap(header, 'space/xs');
    header.appendChild(textBlock('Card title', 'lg', 'semibold', 'color/neutral/text'));
    header.appendChild(textBlock('Supporting description', 'sm', 'regular', 'color/neutral/text-muted'));
    c.appendChild(header);
    c.appendChild(textBlock('Cards group related content and actions on a surface.', 'md', 'regular', 'color/neutral/text'));

    var footer = frame('Footer', 'HORIZONTAL');
    footer.layoutAlign = 'STRETCH';
    footer.primaryAxisSizingMode = 'FIXED';
    footer.primaryAxisAlignItems = 'MAX';
    gap(footer, 'space/sm');
    footer.appendChild(buttonInstance(buttons, 'Ghost', 'Cancel'));
    footer.appendChild(buttonInstance(buttons, 'Solid', 'Confirm'));
    c.appendChild(footer);

    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(320, c.height);
    list.push(c);
  }
  return list;
}

function buildAlerts() {
  var list = [];
  ['soft', 'outline', 'solid'].forEach(function (variant) {
    ['info', 'success', 'warning', 'danger'].forEach(function (color) {
      var base = colorVar(color);
      var onSolid = variant === 'solid';
      var c = component('Variant=' + cap(variant) + ', Color=' + color);
      c.counterAxisAlignItems = 'MIN';
      gap(c, 'space/md');
      padX(c, 'space/lg');
      padY(c, 'space/md');
      radius(c, 'radius/md');
      if (variant === 'soft') {
        c.fills = [solid('color/neutral/surface'), solid(base, 0.1)];
        stroke(c, base, 'border-width/sm', 0.3);
      } else if (variant === 'outline') {
        fill(c, 'color/neutral/surface');
        stroke(c, base, 'border-width/sm');
      } else {
        fill(c, base);
      }
      c.appendChild(icon(INFO_SVG, onSolid ? base + '-foreground' : base));

      var content = frame('Content', 'VERTICAL');
      content.counterAxisAlignItems = 'MIN';
      content.layoutGrow = 1;
      content.appendChild(textBlock(cap(color) + ' title', 'md', 'semibold', onSolid ? base + '-foreground' : 'color/neutral/text'));
      content.appendChild(
        textBlock('A short message that explains what happened.', 'md', 'regular', onSolid ? base + '-foreground' : 'color/neutral/text-muted'),
      );
      c.appendChild(content);

      c.primaryAxisSizingMode = 'FIXED';
      c.resize(400, c.height);
      list.push(c);
    });
  });
  return list;
}

async function buildTabs() {
  var list = [];
  var styles = ['Line', 'Pill'];
  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    var c = component('Style=' + style);
    if (style === 'Line') {
      gap(c, 'space/xl');
      c.strokes = [solid('color/neutral/border')];
      c.strokeTopWeight = c.strokeLeftWeight = c.strokeRightWeight = 0;
      c.strokeBottomWeight = L['border-width/sm'];
      c.counterAxisAlignItems = 'MAX';
    } else {
      gap(c, 'space/xs');
      c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 4;
      radius(c, 'radius/md');
      c.fills = [solid('color/neutral/surface'), solid('color/neutral/text', 0.06)];
    }
    var labels = ['Overview', 'Members', 'Settings'];
    for (var j = 0; j < labels.length; j++) {
      var active = j === 0;
      var tab = frame('Tab', 'HORIZONTAL');
      tab.appendChild(text(labels[j], 'md', 'medium', active ? 'color/neutral/text' : 'color/neutral/text-muted'));
      if (style === 'Line') {
        padY(tab, 'space/sm');
        if (active) {
          tab.strokes = [solid('color/brand/primary')];
          tab.strokeTopWeight = tab.strokeLeftWeight = tab.strokeRightWeight = 0;
          tab.strokeBottomWeight = L['border-width/md'];
          bind(tab, 'strokeBottomWeight', 'border-width/md');
        }
      } else {
        tab.paddingTop = tab.paddingBottom = 6;
        padX(tab, 'space/md');
        radius(tab, 'radius/sm');
        if (active) {
          fill(tab, 'color/neutral/surface');
          await applyShadow(tab, 'sm');
        }
      }
      c.appendChild(tab);
    }
    list.push(c);
  }
  return list;
}

function buildAvatars() {
  return [
    ['sm', 24],
    ['md', 32],
    ['lg', 40],
    ['xl', 56],
  ].map(function (entry) {
    var size = entry[1];
    var c = component('Size=' + entry[0]);
    c.primaryAxisAlignItems = 'CENTER';
    c.primaryAxisSizingMode = 'FIXED';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(size, size);
    c.cornerRadius = size / 2;
    c.fills = [solid('color/neutral/surface'), solid('color/brand/primary', 0.16)];
    var t = figma.createText();
    t.fontName = { family: FONT_FAMILY, style: 'Semi Bold' };
    t.characters = 'KM';
    t.fontSize = Math.round(size * 0.4);
    t.fills = [solid('color/brand/primary')];
    c.appendChild(t);
    return c;
  });
}

/* ---------- shared pieces for the remaining components ---------- */

/** Instance of a built variant, optionally overriding its first text layer */
function instanceOf(list, name, label) {
  var main = list.find(function (c) {
    return c.name === name;
  });
  if (!main) throw new Error('Missing variant "' + name + '"');
  var inst = main.createInstance();
  if (label != null) {
    var t = inst.findOne(function (n) {
      return n.type === 'TEXT';
    });
    if (t) t.characters = label;
  }
  return inst;
}

/** Fixed-width surface panel: surface fill, border, radius, optional shadow */
async function panel(name, width, direction, radiusName, shadowLevel) {
  var p = frame(name, direction || 'VERTICAL');
  p.counterAxisAlignItems = 'MIN';
  fill(p, 'color/neutral/surface');
  stroke(p, 'color/neutral/border', 'border-width/sm');
  radius(p, radiusName || 'radius/lg');
  if (shadowLevel) await applyShadow(p, shadowLevel);
  if (width) {
    if (p.layoutMode === 'VERTICAL') {
      p.counterAxisSizingMode = 'FIXED';
      p.resize(width, Math.max(p.height, 1));
    } else {
      p.primaryAxisSizingMode = 'FIXED';
      p.resize(width, Math.max(p.height, 1));
    }
  }
  return p;
}

/** Input-like field shell (Select, Combobox, Date picker trigger) */
function fieldShell(c, size, invalid) {
  fill(c, 'color/neutral/surface');
  stroke(c, invalid ? 'color/status/danger' : 'color/neutral/border', 'border-width/sm');
  radius(c, 'radius/md');
  padX(c, 'size/' + size + '/padding-x');
  gap(c, 'space/sm');
}

function finishFieldShell(c, size, width) {
  c.primaryAxisSizingMode = 'FIXED';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(width || 240, L['size/' + size + '/height']);
  bind(c, 'height', 'size/' + size + '/height');
}

function growText(chars, step, weight, color) {
  var t = text(chars, step, weight, color);
  return t;
}

function appendGrow(parent, child) {
  parent.appendChild(child);
  child.layoutGrow = 1;
  if (child.type === 'TEXT') child.textAutoResize = 'HEIGHT';
  return child;
}

function line(name, width, height, colorName, opacity) {
  var f = figma.createFrame();
  f.name = name;
  f.resize(width, height);
  fill(f, colorName, opacity);
  return f;
}

/* ---------- actions ---------- */

var ICON_SIZE = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 };

function buildIconButtons() {
  var list = [];
  ['solid', 'soft', 'outline', 'ghost'].forEach(function (variant) {
    SIZES.forEach(function (size) {
      var c = component('Variant=' + cap(variant) + ', Size=' + size);
      c.primaryAxisAlignItems = 'CENTER';
      var base = 'color/brand/primary';
      var fg = base;
      if (variant === 'solid') {
        fill(c, base);
        stroke(c, base, 'border-width/sm');
        fg = base + '-foreground';
      } else if (variant === 'soft') {
        fill(c, base, 0.12);
      } else if (variant === 'outline') {
        stroke(c, base, 'border-width/sm');
      }
      c.appendChild(icon(svgIcon(ICON.plus, ICON_SIZE[size]), fg));
      c.primaryAxisSizingMode = 'FIXED';
      c.counterAxisSizingMode = 'FIXED';
      var h = L['size/' + size + '/height'];
      c.resize(h, h);
      bind(c, 'width', 'size/' + size + '/height');
      bind(c, 'height', 'size/' + size + '/height');
      radius(c, 'radius/md');
      list.push(c);
    });
  });
  return list;
}

function buildButtonGroups(buttons) {
  return ['Outline', 'Solid'].map(function (variant) {
    var c = component('Variant=' + variant);
    // Overlap the borders of neighbors, like the CSS version
    c.itemSpacing = variant === 'Outline' ? -L['border-width/sm'] : 0;
    var labels = ['Day', 'Week', 'Month'];
    labels.forEach(function (label, i) {
      var inst = instanceOf(buttons, 'Variant=' + variant + ', Size=md, Color=primary', label);
      var first = i === 0;
      var last = i === labels.length - 1;
      inst.topLeftRadius = inst.bottomLeftRadius = first ? L['radius/md'] : 0;
      inst.topRightRadius = inst.bottomRightRadius = last ? L['radius/md'] : 0;
      c.appendChild(inst);
    });
    return c;
  });
}

function buildLinks() {
  var list = [];
  ['Default', 'External'].forEach(function (type) {
    ['Default', 'Hover'].forEach(function (state) {
      var c = component('Type=' + type + ', State=' + state);
      c.itemSpacing = 2;
      var t = text(type === 'External' ? 'External link' : 'Link text', 'md', 'medium', 'color/brand/primary');
      if (state === 'Hover') t.textDecoration = 'UNDERLINE';
      c.appendChild(t);
      if (type === 'External') c.appendChild(icon(svgIcon(ICON.external, 12), 'color/brand/primary'));
      list.push(c);
    });
  });
  return list;
}

/* ---------- forms ---------- */

function buildFields(inputs) {
  return ['Default', 'Error'].map(function (state) {
    var c = component('State=' + state, 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    gap(c, 'space/xs');
    var label = frame('Label', 'HORIZONTAL');
    label.itemSpacing = 2;
    label.appendChild(text('Email', 'sm', 'semibold', 'color/neutral/text'));
    label.appendChild(text('*', 'sm', 'semibold', 'color/status/danger'));
    c.appendChild(label);
    c.appendChild(instanceOf(inputs, 'Size=md, State=' + (state === 'Error' ? 'Invalid' : 'Default')));
    c.appendChild(
      text(
        state === 'Error' ? 'Enter a valid email address' : 'We never share your email',
        'sm',
        'regular',
        state === 'Error' ? 'color/status/danger' : 'color/neutral/text-muted',
      ),
    );
    return c;
  });
}

function buildTextareas() {
  return ['Default', 'Invalid', 'Disabled'].map(function (state) {
    var c = component('State=' + state, 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    fill(c, 'color/neutral/surface');
    stroke(c, state === 'Invalid' ? 'color/status/danger' : 'color/neutral/border', 'border-width/sm');
    radius(c, 'radius/md');
    padX(c, 'size/md/padding-x');
    padY(c, 'space/sm');
    var t = text(state === 'Invalid' ? 'Invalid message' : 'Write a message…', 'md', 'regular',
      state === 'Invalid' ? 'color/neutral/text' : 'color/neutral/text-muted');
    c.appendChild(t);
    t.layoutAlign = 'STRETCH';
    t.textAutoResize = 'HEIGHT';
    c.primaryAxisSizingMode = 'FIXED';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(240, 96);
    if (state === 'Disabled') c.opacity = 0.5;
    return c;
  });
}

function buildSelects() {
  var list = [];
  ['sm', 'md', 'lg'].forEach(function (size) {
    ['Placeholder', 'Selected', 'Invalid', 'Disabled'].forEach(function (state) {
      var c = component('Size=' + size + ', State=' + state);
      fieldShell(c, size, state === 'Invalid');
      var selected = state === 'Selected';
      appendGrow(c, text(selected ? 'South Korea' : 'Select an option', size, 'regular', selected ? 'color/neutral/text' : 'color/neutral/text-muted'));
      c.appendChild(icon(svgIcon(ICON.chevronDown, 16), 'color/neutral/text-muted'));
      finishFieldShell(c, size);
      if (state === 'Disabled') c.opacity = 0.5;
      list.push(c);
    });
  });
  return list;
}

async function menuItem(label, opts) {
  var item = frame('Item', 'HORIZONTAL');
  item.layoutAlign = 'STRETCH';
  item.primaryAxisSizingMode = 'FIXED';
  item.counterAxisSizingMode = 'FIXED';
  padX(item, 'space/sm');
  gap(item, 'space/sm');
  radius(item, 'radius/sm');
  if (opts.active) fill(item, opts.danger ? 'color/status/danger' : 'color/neutral/text', opts.danger ? 0.1 : 0.07);
  var color = opts.danger ? 'color/status/danger' : 'color/neutral/text';
  if (opts.check != null) {
    var slot = frame('Check', 'HORIZONTAL');
    slot.primaryAxisSizingMode = 'FIXED';
    slot.counterAxisSizingMode = 'FIXED';
    slot.resize(14, 14);
    if (opts.check) slot.appendChild(icon(svgIcon(ICON.check, 14), 'color/brand/primary'));
    item.appendChild(slot);
  }
  appendGrow(item, text(label, 'md', opts.check ? 'semibold' : 'regular', color));
  if (opts.hint) item.appendChild(text(opts.hint, 'xs', 'regular', 'color/neutral/text-muted'));
  item.resize(Math.max(item.width, 1), 32);
  if (opts.disabled) item.opacity = 0.5;
  return item;
}

async function buildMenu() {
  var c = component('Dropdown menu', 'VERTICAL');
  c.counterAxisAlignItems = 'MIN';
  fill(c, 'color/neutral/surface');
  stroke(c, 'color/neutral/border', 'border-width/sm');
  radius(c, 'radius/md');
  await applyShadow(c, 'lg');
  c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = L['space/xs'];
  ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'].forEach(function (f) {
    bind(c, f, 'space/xs');
  });
  c.counterAxisSizingMode = 'FIXED';
  c.resize(200, Math.max(c.height, 1));
  c.appendChild(await menuItem('Edit', { hint: 'Ctrl E', active: true }));
  c.appendChild(await menuItem('Duplicate', { hint: 'Ctrl D' }));
  c.appendChild(await menuItem('Archive', { disabled: true }));
  var sep = line('Separator', 192, L['border-width/sm'], 'color/neutral/border');
  sep.layoutAlign = 'STRETCH';
  c.appendChild(sep);
  c.appendChild(await menuItem('Delete', { danger: true }));
  return [c];
}

async function buildComboboxes() {
  var list = [];
  var states = ['Closed', 'Open'];
  for (var i = 0; i < states.length; i++) {
    var open = states[i] === 'Open';
    var c = component('State=' + states[i], 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    c.itemSpacing = 6;

    var input = frame('Input', 'HORIZONTAL');
    fieldShell(input, 'md', false);
    appendGrow(input, text(open ? 'Se' : 'Seoul', 'md', 'regular', 'color/neutral/text'));
    input.appendChild(icon(svgIcon(ICON.chevronDown, 16), 'color/neutral/text-muted'));
    finishFieldShell(input, 'md');
    c.appendChild(input);

    if (open) {
      var list2 = await panel('Listbox', 240, 'VERTICAL', 'radius/md', 'lg');
      list2.paddingLeft = list2.paddingRight = list2.paddingTop = list2.paddingBottom = L['space/xs'];
      list2.appendChild(await menuItem('Seoul', { check: true, hint: 'KR', active: true }));
      list2.appendChild(await menuItem('Busan', { check: false, hint: 'KR' }));
      list2.appendChild(await menuItem('Berlin', { check: false, hint: 'DE', disabled: true }));
      c.appendChild(list2);
    }
    list.push(c);
  }
  return list;
}

function buildSliders() {
  return COLORS.map(function (color, i) {
    var base = colorVar(color);
    var c = component('Color=' + color);
    c.layoutMode = 'NONE';
    c.resize(240, 20);
    var track = line('Track', 240, 6, 'color/neutral/text', 0.12);
    track.cornerRadius = 3;
    track.y = 7;
    c.appendChild(track);
    var pct = 0.3 + i * 0.1;
    var filled = line('Fill', Math.round(240 * pct), 6, base);
    filled.cornerRadius = 3;
    filled.y = 7;
    c.appendChild(filled);
    var thumb = figma.createEllipse();
    thumb.name = 'Thumb';
    thumb.resize(18, 18);
    thumb.x = Math.round(240 * pct) - 9;
    thumb.y = 1;
    thumb.fills = [solid('color/neutral/surface')];
    thumb.strokes = [solid(base)];
    thumb.strokeWeight = 2;
    c.appendChild(thumb);
    return c;
  });
}

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function buildDatePickers() {
  return ['Placeholder', 'Selected'].map(function (state) {
    var c = component('State=' + state);
    fieldShell(c, 'md', false);
    c.appendChild(icon(svgIcon(ICON.calendar, 16), 'color/neutral/text-muted'));
    var now = new Date();
    var label = MONTHS[now.getMonth()].slice(0, 3) + ' ' + now.getDate() + ', ' + now.getFullYear();
    appendGrow(c, text(state === 'Selected' ? label : 'Select date', 'md', 'regular', state === 'Selected' ? 'color/neutral/text' : 'color/neutral/text-muted'));
    finishFieldShell(c, 'md');
    return c;
  });
}

function dayCell(label, opts) {
  var cell = frame('Day', 'HORIZONTAL');
  cell.primaryAxisAlignItems = 'CENTER';
  cell.primaryAxisSizingMode = 'FIXED';
  cell.counterAxisSizingMode = 'FIXED';
  cell.resize(36, opts.header ? 28 : 36);
  radius(cell, 'radius/md');
  if (opts.selected) fill(cell, 'color/brand/primary');
  if (opts.today) stroke(cell, 'color/neutral/border', 'border-width/sm');
  var color = opts.selected ? 'color/brand/primary-foreground' : opts.header || opts.outside ? 'color/neutral/text-muted' : 'color/neutral/text';
  var t = text(label, opts.header ? 'xs' : 'sm', opts.today || opts.selected || opts.header ? 'semibold' : 'regular', color);
  if (opts.outside) t.opacity = 0.6;
  cell.appendChild(t);
  return cell;
}

async function buildCalendar() {
  var c = component('Calendar', 'VERTICAL');
  c.counterAxisAlignItems = 'MIN';
  fill(c, 'color/neutral/surface');
  stroke(c, 'color/neutral/border', 'border-width/sm');
  radius(c, 'radius/lg');
  await applyShadow(c, 'lg');
  padX(c, 'space/md');
  padY(c, 'space/md');
  gap(c, 'space/sm');

  var now = new Date();
  var header = frame('Header', 'HORIZONTAL');
  header.layoutAlign = 'STRETCH';
  header.primaryAxisSizingMode = 'FIXED';
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  header.appendChild(icon(svgIcon(ICON.chevronLeft, 16), 'color/neutral/text-muted'));
  header.appendChild(text(MONTHS[now.getMonth()] + ' ' + now.getFullYear(), 'md', 'semibold', 'color/neutral/text'));
  header.appendChild(icon(svgIcon(ICON.chevronRight, 16), 'color/neutral/text-muted'));
  c.appendChild(header);

  var weekRow = frame('Weekdays', 'HORIZONTAL');
  weekRow.itemSpacing = 2;
  ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(function (d) {
    weekRow.appendChild(dayCell(d, { header: true }));
  });
  c.appendChild(weekRow);

  var first = new Date(now.getFullYear(), now.getMonth(), 1);
  var start = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
  for (var w = 0; w < 6; w++) {
    var row = frame('Week', 'HORIZONTAL');
    row.itemSpacing = 2;
    for (var d = 0; d < 7; d++) {
      var day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
      var isToday = day.toDateString() === now.toDateString();
      row.appendChild(
        dayCell(String(day.getDate()), {
          outside: day.getMonth() !== now.getMonth(),
          today: isToday,
          selected: day.getMonth() === now.getMonth() && day.getDate() === Math.min(now.getDate() + 3, 28),
        }),
      );
    }
    c.appendChild(row);
  }
  return [c];
}

function buildFileUploads() {
  return ['Default', 'Dragging', 'Disabled'].map(function (state) {
    var c = component('State=' + state, 'VERTICAL');
    c.primaryAxisAlignItems = 'CENTER';
    gap(c, 'space/xs');
    padX(c, 'space/xl');
    padY(c, 'space/2xl');
    radius(c, 'radius/lg');
    var active = state === 'Dragging';
    if (active) c.fills = [solid('color/neutral/surface'), solid('color/brand/primary', 0.04)];
    else fill(c, 'color/neutral/surface');
    stroke(c, active ? 'color/brand/primary' : 'color/neutral/border', 'border-width/md');
    c.dashPattern = [6, 4];
    c.appendChild(icon(svgIcon(ICON.upload, 28), 'color/neutral/text-muted'));
    var prompt = frame('Prompt', 'HORIZONTAL');
    prompt.itemSpacing = 4;
    prompt.appendChild(text('Click to upload', 'md', 'semibold', 'color/brand/primary'));
    prompt.appendChild(text('or drag and drop', 'md', 'regular', 'color/neutral/text-muted'));
    c.appendChild(prompt);
    c.appendChild(text('PNG, JPG or PDF up to 5 MB', 'sm', 'regular', 'color/neutral/text-muted'));
    c.counterAxisSizingMode = 'FIXED';
    c.resize(360, Math.max(c.height, 1));
    if (state === 'Disabled') c.opacity = 0.5;
    return c;
  });
}

/* ---------- data display ---------- */

var TABLE_COLUMNS = [
  { label: 'Name', width: 220 },
  { label: 'Role', width: 160 },
  { label: 'Status', width: 120 },
  { label: 'Projects', width: 100, right: true },
];
var TABLE_ROWS = [
  ['Kim Minji', 'Designer', 'Active', '12'],
  ['Lee Jun', 'Developer', 'Invited', '7'],
  ['Park Seoyeon', 'Product manager', 'Active', '18'],
  ['Choi Hyun', 'Researcher', 'Suspended', '3'],
];
var STATUS_COLOR = { Active: 'success', Invited: 'info', Suspended: 'danger' };

function tableCell(col, content, density, header) {
  var cell = frame('Cell', 'HORIZONTAL');
  cell.primaryAxisSizingMode = 'FIXED';
  cell.primaryAxisAlignItems = col.right ? 'MAX' : 'MIN';
  padX(cell, density === 'Compact' ? 'space/md' : 'space/lg');
  padY(cell, density === 'Compact' ? 'space/xs' : 'space/md');
  cell.appendChild(content);
  cell.resize(col.width, Math.max(cell.height, 1));
  if (header) cell.counterAxisSizingMode = 'AUTO';
  return cell;
}

function buildTables(badges) {
  return ['Comfortable', 'Compact'].map(function (density) {
    var c = component('Density=' + density, 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    c.itemSpacing = 0;
    fill(c, 'color/neutral/surface');
    stroke(c, 'color/neutral/border', 'border-width/sm');
    radius(c, 'radius/lg');
    c.clipsContent = true;

    var head = frame('Header row', 'HORIZONTAL');
    head.fills = [solid('color/neutral/text', 0.03)];
    TABLE_COLUMNS.forEach(function (col) {
      head.appendChild(tableCell(col, text(col.label, 'sm', 'semibold', 'color/neutral/text-muted'), density, true));
    });
    head.strokes = [solid('color/neutral/border')];
    head.strokeTopWeight = head.strokeLeftWeight = head.strokeRightWeight = 0;
    head.strokeBottomWeight = L['border-width/sm'];
    c.appendChild(head);

    TABLE_ROWS.forEach(function (row, r) {
      var tr = frame('Row', 'HORIZONTAL');
      TABLE_COLUMNS.forEach(function (col, i) {
        var content =
          i === 2
            ? instanceOf(badges, 'Variant=Soft, Size=sm, Color=' + STATUS_COLOR[row[2]], row[2])
            : text(row[i], 'md', i === 0 ? 'medium' : 'regular', 'color/neutral/text');
        tr.appendChild(tableCell(col, content, density));
      });
      if (r < TABLE_ROWS.length - 1) {
        tr.strokes = [solid('color/neutral/border')];
        tr.strokeTopWeight = tr.strokeLeftWeight = tr.strokeRightWeight = 0;
        tr.strokeBottomWeight = L['border-width/sm'];
      }
      c.appendChild(tr);
    });
    return c;
  });
}

function pageItem(label, current) {
  var item = frame('Page', 'HORIZONTAL');
  item.primaryAxisAlignItems = 'CENTER';
  item.primaryAxisSizingMode = 'FIXED';
  item.counterAxisSizingMode = 'FIXED';
  item.resize(L['size/sm/height'], L['size/sm/height']);
  radius(item, 'radius/md');
  if (current) fill(item, 'color/brand/primary');
  if (label === '<' || label === '>') {
    item.appendChild(icon(svgIcon(label === '<' ? ICON.chevronLeft : ICON.chevronRight, 16), 'color/neutral/text'));
  } else {
    item.appendChild(
      text(label, 'sm', current ? 'semibold' : 'medium', current ? 'color/brand/primary-foreground' : label === '…' ? 'color/neutral/text-muted' : 'color/neutral/text'),
    );
  }
  return item;
}

function buildPagination() {
  var c = component('Pagination');
  gap(c, 'space/xs');
  ['<', '1', '…', '4', '5', '6', '7', '8', '…', '20', '>'].forEach(function (label, i) {
    c.appendChild(pageItem(label, i === 5));
  });
  return [c];
}

function accordionItem(title, body, expanded) {
  var item = frame('Item', 'VERTICAL');
  item.counterAxisAlignItems = 'MIN';
  item.layoutAlign = 'STRETCH';
  var trigger = frame('Trigger', 'HORIZONTAL');
  trigger.layoutAlign = 'STRETCH';
  trigger.primaryAxisSizingMode = 'FIXED';
  padX(trigger, 'space/xl');
  padY(trigger, 'space/lg');
  gap(trigger, 'space/md');
  appendGrow(trigger, text(title, 'md', 'semibold', 'color/neutral/text'));
  trigger.appendChild(icon(svgIcon(expanded ? ICON.chevronUp : ICON.chevronDown, 16), 'color/neutral/text-muted'));
  item.appendChild(trigger);
  if (expanded) {
    var content = frame('Content', 'VERTICAL');
    content.layoutAlign = 'STRETCH';
    content.counterAxisAlignItems = 'MIN';
    padX(content, 'space/xl');
    content.paddingBottom = L['space/lg'];
    bind(content, 'paddingBottom', 'space/lg');
    var t = text(body, 'md', 'regular', 'color/neutral/text-muted');
    content.appendChild(t);
    t.layoutAlign = 'STRETCH';
    t.textAutoResize = 'HEIGHT';
    item.appendChild(content);
  }
  return item;
}

function buildAccordions() {
  return ['Contained', 'Separated'].map(function (variant) {
    var c = component('Variant=' + variant, 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    var faq = [
      ['What are design tokens?', 'Named values for color, type, spacing and more, shared between design and code.'],
      ['Can light and dark mode differ?', 'Yes. Every settings section keeps separate values for light and dark.'],
      ['How do I use them in my app?', 'Each token is a CSS variable such as --dt-primary or --dt-space-md.'],
    ];
    if (variant === 'Contained') {
      fill(c, 'color/neutral/surface');
      stroke(c, 'color/neutral/border', 'border-width/sm');
      radius(c, 'radius/lg');
      c.clipsContent = true;
    } else {
      gap(c, 'space/sm');
    }
    faq.forEach(function (q, i) {
      var item = accordionItem(q[0], q[1], i === 0);
      if (variant === 'Separated') {
        fill(item, 'color/neutral/surface');
        stroke(item, 'color/neutral/border', 'border-width/sm');
        radius(item, 'radius/md');
      } else if (i < faq.length - 1) {
        item.strokes = [solid('color/neutral/border')];
        item.strokeTopWeight = item.strokeLeftWeight = item.strokeRightWeight = 0;
        item.strokeBottomWeight = L['border-width/sm'];
      }
      c.appendChild(item);
    });
    c.counterAxisSizingMode = 'FIXED';
    c.resize(480, Math.max(c.height, 1));
    return c;
  });
}

function buildEmptyStates(buttons) {
  return ['No', 'Yes'].map(function (bordered) {
    var c = component('Bordered=' + bordered, 'VERTICAL');
    gap(c, 'space/lg');
    padX(c, 'space/xl');
    padY(c, 'space/3xl');
    if (bordered === 'Yes') {
      stroke(c, 'color/neutral/border', 'border-width/sm');
      c.dashPattern = [6, 4];
      radius(c, 'radius/lg');
    }
    var circle = frame('Icon', 'HORIZONTAL');
    circle.primaryAxisAlignItems = 'CENTER';
    circle.primaryAxisSizingMode = 'FIXED';
    circle.counterAxisSizingMode = 'FIXED';
    circle.resize(56, 56);
    circle.cornerRadius = 28;
    fill(circle, 'color/neutral/text', 0.06);
    circle.appendChild(icon(svgIcon(ICON.folder, 28), 'color/neutral/text-muted'));
    c.appendChild(circle);
    var copy = frame('Text', 'VERTICAL');
    gap(copy, 'space/xs');
    copy.appendChild(text('No projects yet', 'lg', 'semibold', 'color/neutral/text'));
    copy.appendChild(text('Create your first project to get started.', 'md', 'regular', 'color/neutral/text-muted'));
    c.appendChild(copy);
    var actions = frame('Actions', 'HORIZONTAL');
    gap(actions, 'space/sm');
    actions.appendChild(instanceOf(buttons, 'Variant=Outline, Size=md, Color=primary', 'Import'));
    actions.appendChild(instanceOf(buttons, 'Variant=Solid, Size=md, Color=primary', 'New project'));
    c.appendChild(actions);
    c.counterAxisSizingMode = 'FIXED';
    c.resize(400, Math.max(c.height, 1));
    return c;
  });
}

/* ---------- feedback ---------- */

async function buildToasts() {
  var list = [];
  var colors = ['info', 'success', 'warning', 'danger'];
  for (var i = 0; i < colors.length; i++) {
    var base = colorVar(colors[i]);
    var c = component('Color=' + colors[i]);
    c.counterAxisAlignItems = 'MIN';
    gap(c, 'space/md');
    padX(c, 'space/lg');
    padY(c, 'space/md');
    fill(c, 'color/neutral/surface');
    stroke(c, 'color/neutral/border', 'border-width/sm');
    radius(c, 'radius/lg');
    await applyShadow(c, 'lg');
    c.appendChild(icon(INFO_SVG, base));
    var content = frame('Content', 'VERTICAL');
    content.counterAxisAlignItems = 'MIN';
    content.itemSpacing = 2;
    content.appendChild(text(cap(colors[i]) + ' toast', 'md', 'semibold', 'color/neutral/text'));
    content.appendChild(text('Your changes were saved.', 'sm', 'regular', 'color/neutral/text-muted'));
    appendGrow(c, content);
    c.appendChild(icon(svgIcon(ICON.close, 16), 'color/neutral/text-muted'));
    c.primaryAxisSizingMode = 'FIXED';
    c.resize(360, Math.max(c.height, 1));
    list.push(c);
  }
  return list;
}

function buildProgress() {
  var list = [];
  [['sm', 4], ['md', 8], ['lg', 12]].forEach(function (s) {
    COLORS.forEach(function (color, i) {
      var c = component('Size=' + s[0] + ', Color=' + color);
      c.layoutMode = 'NONE';
      c.resize(240, s[1]);
      c.clipsContent = true;
      c.cornerRadius = s[1] / 2;
      fill(c, 'color/neutral/text', 0.1);
      var bar = line('Bar', Math.round(240 * (0.3 + i * 0.1)), s[1], colorVar(color));
      bar.cornerRadius = s[1] / 2;
      c.appendChild(bar);
      list.push(c);
    });
  });
  return list;
}

function buildSpinners() {
  return [['sm', 16, 2], ['md', 24, 2.5], ['lg', 36, 3]].map(function (s) {
    var c = component('Size=' + s[0]);
    var size = s[1];
    var r = (size - s[2]) / 2;
    var mid = size / 2;
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + mid + '" cy="' + mid + '" r="' + r + '" fill="none" stroke="#000" stroke-width="' + s[2] + '"/></svg>';
    var arc =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<path d="M' + mid + ' ' + (mid - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (mid + r) + ' ' + mid + '" fill="none" stroke="#000" stroke-width="' + s[2] + '" stroke-linecap="round"/></svg>';
    c.layoutMode = 'NONE';
    c.resize(size, size);
    c.appendChild(icon(svg, 'color/neutral/text', 0.2));
    c.appendChild(icon(arc, 'color/neutral/text'));
    return c;
  });
}

function buildSkeletons() {
  return ['Text', 'Circle', 'Rect', 'Card'].map(function (shape) {
    var c = component('Shape=' + shape, 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    var bone = function (w, h, r) {
      var b = line('Bone', w, h, 'color/neutral/text', 0.08);
      if (r == null) radius(b, 'radius/sm');
      else b.cornerRadius = r;
      return b;
    };
    if (shape === 'Text') {
      c.itemSpacing = L['font/line-height/md'] - L['font/size/md'];
      c.appendChild(bone(280, L['font/size/md']));
      c.appendChild(bone(280, L['font/size/md']));
      c.appendChild(bone(168, L['font/size/md']));
    } else if (shape === 'Circle') {
      c.appendChild(bone(40, 40, 20));
    } else if (shape === 'Rect') {
      var rect = bone(280, 120);
      radius(rect, 'radius/md');
      c.appendChild(rect);
    } else {
      gap(c, 'space/md');
      padX(c, 'space/xl');
      padY(c, 'space/xl');
      fill(c, 'color/neutral/surface');
      stroke(c, 'color/neutral/border', 'border-width/sm');
      radius(c, 'radius/lg');
      var head = frame('Header', 'HORIZONTAL');
      gap(head, 'space/md');
      head.appendChild(bone(40, 40, 20));
      var lines = frame('Lines', 'VERTICAL');
      lines.counterAxisAlignItems = 'MIN';
      lines.itemSpacing = 7;
      lines.appendChild(bone(180, 14));
      lines.appendChild(bone(110, 14));
      head.appendChild(lines);
      c.appendChild(head);
      var big = bone(272, 100);
      radius(big, 'radius/md');
      c.appendChild(big);
    }
    return c;
  });
}

/* ---------- overlay ---------- */

function overlayHeader(title, description, titleStep) {
  var header = frame('Header', 'HORIZONTAL');
  header.layoutAlign = 'STRETCH';
  header.primaryAxisSizingMode = 'FIXED';
  header.counterAxisAlignItems = 'MIN';
  gap(header, 'space/md');
  var copy = frame('Title', 'VERTICAL');
  copy.counterAxisAlignItems = 'MIN';
  gap(copy, 'space/xs');
  copy.appendChild(text(title, titleStep, 'semibold', 'color/neutral/text'));
  if (description) {
    var d = text(description, titleStep === 'xl' ? 'md' : 'sm', 'regular', 'color/neutral/text-muted');
    copy.appendChild(d);
    d.layoutAlign = 'STRETCH';
    d.textAutoResize = 'HEIGHT';
  }
  appendGrow(header, copy);
  header.appendChild(icon(svgIcon(ICON.close, 18), 'color/neutral/text-muted'));
  return header;
}

function footerRow(buttons, labels) {
  var footer = frame('Footer', 'HORIZONTAL');
  footer.layoutAlign = 'STRETCH';
  footer.primaryAxisSizingMode = 'FIXED';
  footer.primaryAxisAlignItems = 'MAX';
  gap(footer, 'space/sm');
  footer.appendChild(instanceOf(buttons, 'Variant=Ghost, Size=md, Color=primary', labels[0]));
  footer.appendChild(instanceOf(buttons, 'Variant=Solid, Size=md, Color=' + (labels[2] || 'primary'), labels[1]));
  return footer;
}

async function buildDialogs(buttons, inputs) {
  var list = [];
  var sizes = [['sm', 400], ['md', 520], ['lg', 720]];
  for (var i = 0; i < sizes.length; i++) {
    var c = component('Size=' + sizes[i][0], 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    gap(c, 'space/lg');
    padX(c, 'space/xl');
    padY(c, 'space/xl');
    fill(c, 'color/neutral/surface');
    stroke(c, 'color/neutral/border', 'border-width/sm');
    radius(c, 'radius/lg');
    await applyShadow(c, 'xl');
    c.counterAxisSizingMode = 'FIXED';
    c.resize(sizes[i][1], Math.max(c.height, 1));
    c.appendChild(overlayHeader('Send feedback', 'Tell us what you think about the design tokens.', 'xl'));
    var input = instanceOf(inputs, 'Size=md, State=Default');
    input.layoutAlign = 'STRETCH';
    c.appendChild(input);
    c.appendChild(footerRow(buttons, ['Cancel', 'Send']));
    list.push(c);
  }
  return list;
}

async function buildDrawers(buttons, inputs) {
  var list = [];
  var sides = [['Right', 400, 560], ['Bottom', 720, 260]];
  for (var i = 0; i < sides.length; i++) {
    var side = sides[i][0];
    var c = component('Side=' + side, 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    c.itemSpacing = 0;
    fill(c, 'color/neutral/surface');
    stroke(c, 'color/neutral/border', 'border-width/sm');
    await applyShadow(c, 'xl');
    if (side === 'Bottom') {
      c.topLeftRadius = c.topRightRadius = L['radius/lg'];
      bind(c, 'topLeftRadius', 'radius/lg');
      bind(c, 'topRightRadius', 'radius/lg');
    }

    var header = overlayHeader('Filters', 'Narrow down the member list', 'lg');
    padX(header, 'space/xl');
    padY(header, 'space/lg');
    header.strokes = [solid('color/neutral/border')];
    header.strokeTopWeight = header.strokeLeftWeight = header.strokeRightWeight = 0;
    header.strokeBottomWeight = L['border-width/sm'];
    c.appendChild(header);

    var body = frame('Body', 'VERTICAL');
    body.layoutAlign = 'STRETCH';
    body.counterAxisAlignItems = 'MIN';
    body.layoutGrow = 1;
    padX(body, 'space/xl');
    padY(body, 'space/xl');
    gap(body, 'space/lg');
    var input = instanceOf(inputs, 'Size=md, State=Default');
    input.layoutAlign = 'STRETCH';
    body.appendChild(input);
    c.appendChild(body);

    var footer = footerRow(buttons, ['Reset', 'Apply']);
    padX(footer, 'space/xl');
    padY(footer, 'space/lg');
    footer.strokes = [solid('color/neutral/border')];
    footer.strokeBottomWeight = footer.strokeLeftWeight = footer.strokeRightWeight = 0;
    footer.strokeTopWeight = L['border-width/sm'];
    c.appendChild(footer);

    c.primaryAxisSizingMode = 'FIXED';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(sides[i][1], sides[i][2]);
    list.push(c);
  }
  return list;
}

async function buildTooltips() {
  var c = component('Tooltip');
  c.paddingLeft = c.paddingRight = L['space/sm'];
  c.paddingTop = c.paddingBottom = L['space/xs'];
  bind(c, 'paddingLeft', 'space/sm');
  bind(c, 'paddingRight', 'space/sm');
  bind(c, 'paddingTop', 'space/xs');
  bind(c, 'paddingBottom', 'space/xs');
  radius(c, 'radius/sm');
  fill(c, 'color/neutral/text');
  await applyShadow(c, 'md');
  c.appendChild(text('Tooltip text', 'sm', 'medium', 'color/neutral/background'));
  return [c];
}

async function buildPopovers(buttons, switches) {
  var c = component('Popover', 'VERTICAL');
  c.counterAxisAlignItems = 'MIN';
  gap(c, 'space/md');
  padX(c, 'space/lg');
  padY(c, 'space/lg');
  fill(c, 'color/neutral/surface');
  stroke(c, 'color/neutral/border', 'border-width/sm');
  radius(c, 'radius/lg');
  await applyShadow(c, 'lg');
  c.appendChild(text('Notifications', 'md', 'semibold', 'color/neutral/text'));
  c.appendChild(instanceOf(switches, 'State=On', 'Email'));
  c.appendChild(instanceOf(switches, 'State=Off', 'Push'));
  c.appendChild(instanceOf(buttons, 'Variant=Solid, Size=sm, Color=primary', 'Done'));
  c.counterAxisSizingMode = 'FIXED';
  c.resize(240, Math.max(c.height, 1));
  return [c];
}

/* ---------- navigation ---------- */

function buildBreadcrumbs() {
  return ['Chevron', 'Slash'].map(function (sep) {
    var c = component('Separator=' + sep);
    gap(c, 'space/xs');
    var items = ['Home', 'Projects', 'Design tokens', 'Settings'];
    items.forEach(function (label, i) {
      if (i > 0) {
        if (sep === 'Chevron') c.appendChild(icon(svgIcon(ICON.chevronRight, 14), 'color/neutral/text-muted', 0.6));
        else c.appendChild(text('/', 'sm', 'regular', 'color/neutral/text-muted'));
      }
      var current = i === items.length - 1;
      c.appendChild(text(label, 'sm', current ? 'semibold' : 'regular', current ? 'color/neutral/text' : 'color/neutral/text-muted'));
    });
    return c;
  });
}

function stepMarker(i, state) {
  var m = frame('Marker', 'HORIZONTAL');
  m.primaryAxisAlignItems = 'CENTER';
  m.primaryAxisSizingMode = 'FIXED';
  m.counterAxisSizingMode = 'FIXED';
  m.resize(28, 28);
  m.cornerRadius = 14;
  if (state === 'complete') {
    fill(m, 'color/brand/primary');
    stroke(m, 'color/brand/primary', 'border-width/md');
    m.appendChild(icon(svgIcon(ICON.check, 14), 'color/brand/primary-foreground'));
  } else {
    fill(m, 'color/neutral/surface');
    stroke(m, state === 'active' ? 'color/brand/primary' : 'color/neutral/border', 'border-width/md');
    m.appendChild(text(String(i + 1), 'sm', 'semibold', state === 'active' ? 'color/brand/primary' : 'color/neutral/text-muted'));
  }
  return m;
}

function buildSteppers() {
  var steps = [
    ['Account', 'Email and password'],
    ['Profile', 'Name and photo'],
    ['Team', 'Invite members'],
    ['Done', 'Start working'],
  ];
  var current = 1;
  return ['Horizontal', 'Vertical'].map(function (orientation) {
    var horizontal = orientation === 'Horizontal';
    var c = component('Orientation=' + orientation, horizontal ? 'HORIZONTAL' : 'VERTICAL');
    c.counterAxisAlignItems = 'MIN';
    gap(c, horizontal ? 'space/md' : 'space/xs');
    steps.forEach(function (step, i) {
      var state = i < current ? 'complete' : i === current ? 'active' : 'upcoming';
      var item = frame('Step', 'HORIZONTAL');
      item.counterAxisAlignItems = 'MIN';
      gap(item, 'space/md');
      item.appendChild(stepMarker(i, state));
      var copy = frame('Text', 'VERTICAL');
      copy.counterAxisAlignItems = 'MIN';
      copy.paddingTop = 3;
      copy.appendChild(text(step[0], 'md', 'semibold', state === 'upcoming' ? 'color/neutral/text-muted' : 'color/neutral/text'));
      copy.appendChild(text(step[1], 'sm', 'regular', 'color/neutral/text-muted'));
      item.appendChild(copy);
      c.appendChild(item);
      if (i < steps.length - 1) {
        var connector = horizontal
          ? line('Connector', 48, L['border-width/md'], i < current ? 'color/brand/primary' : 'color/neutral/border')
          : line('Connector', L['border-width/md'], 24, i < current ? 'color/brand/primary' : 'color/neutral/border');
        if (horizontal) connector.layoutAlign = 'INHERIT';
        else connector.layoutAlign = 'INHERIT';
        var holder = frame('Line', horizontal ? 'HORIZONTAL' : 'VERTICAL');
        if (horizontal) holder.paddingTop = 13;
        else holder.paddingLeft = 13;
        holder.counterAxisAlignItems = 'MIN';
        holder.appendChild(connector);
        c.appendChild(holder);
      }
    });
    return c;
  });
}

/* ---------- layout ---------- */

function buildDividers() {
  return ['Horizontal', 'Vertical', 'Label'].map(function (type) {
    var c = component('Type=' + type);
    if (type === 'Horizontal') {
      c.appendChild(line('Line', 320, L['border-width/sm'], 'color/neutral/border'));
    } else if (type === 'Vertical') {
      c.appendChild(line('Line', L['border-width/sm'], 24, 'color/neutral/border'));
    } else {
      gap(c, 'space/md');
      c.appendChild(line('Line', 140, L['border-width/sm'], 'color/neutral/border'));
      c.appendChild(text('OR', 'sm', 'regular', 'color/neutral/text-muted'));
      c.appendChild(line('Line', 140, L['border-width/sm'], 'color/neutral/border'));
    }
    return c;
  });
}

/* ---------- page ---------- */

function heading(label, size) {
  var t = figma.createText();
  t.fontName = { family: FONT_FAMILY, style: 'Bold' };
  t.characters = label;
  t.fontSize = size;
  t.fills = [solid(size > 30 ? 'color/neutral/text' : 'color/neutral/text')];
  return t;
}

/** Combine variants into a wrapping component set (or place a single component) under a titled section */
function addSection(parent, title, components, width) {
  var section = frame(title, 'VERTICAL');
  section.counterAxisAlignItems = 'MIN';
  section.itemSpacing = 20;
  section.appendChild(heading(title, 24));
  parent.appendChild(section);

  if (components.length === 1 && components[0].name.indexOf('=') < 0) {
    components[0].name = title;
    section.appendChild(components[0]);
    return components[0];
  }

  var set = figma.combineAsVariants(components, section);
  set.name = title;
  set.layoutMode = 'HORIZONTAL';
  set.layoutWrap = 'WRAP';
  set.primaryAxisSizingMode = 'FIXED';
  set.counterAxisSizingMode = 'AUTO';
  set.counterAxisAlignItems = 'MIN';
  set.itemSpacing = 16;
  set.counterAxisSpacing = 16;
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 24;
  set.resize(width || 1280, Math.max(set.height, 1));
  return set;
}

async function buildComponentsPage() {
  var page = figma.createPage();
  page.name = PAGE_NAME;
  await figma.setCurrentPageAsync(page);

  var root = frame('Components', 'VERTICAL');
  root.counterAxisAlignItems = 'MIN';
  root.itemSpacing = 80;
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 80;
  fill(root, 'color/neutral/background');
  root.setExplicitVariableModeForCollection(collection, lightModeId);
  page.appendChild(root);

  // Built lists other components reuse as instances
  var built = {};
  var created = 0;
  var failed = [];

  async function section(group, title, build) {
    try {
      var components = await build();
      addSection(group, title, components);
      created++;
      return components;
    } catch (e) {
      failed.push(title + ': ' + (e && e.message ? e.message : String(e)));
      return [];
    }
  }

  function group(title) {
    var g = frame(title, 'VERTICAL');
    g.counterAxisAlignItems = 'MIN';
    g.itemSpacing = 48;
    g.appendChild(heading(title, 40));
    root.appendChild(g);
    return g;
  }

  var actions = group('Actions');
  built.buttons = await section(actions, 'Button', buildButtons);
  await section(actions, 'Icon Button', buildIconButtons);
  await section(actions, 'Button Group', function () { return buildButtonGroups(built.buttons); });
  await section(actions, 'Link', buildLinks);

  var forms = group('Forms');
  built.inputs = await section(forms, 'Input', buildInputs);
  await section(forms, 'Form Field', function () { return buildFields(built.inputs); });
  await section(forms, 'Textarea', buildTextareas);
  await section(forms, 'Checkbox', function () { return buildChoices('checkbox'); });
  await section(forms, 'Radio', function () { return buildChoices('radio'); });
  built.switches = await section(forms, 'Switch', buildSwitches);
  await section(forms, 'Select', buildSelects);
  await section(forms, 'Dropdown Menu', buildMenu);
  await section(forms, 'Combobox', buildComboboxes);
  await section(forms, 'Slider', buildSliders);
  await section(forms, 'Date Picker', buildDatePickers);
  await section(forms, 'Calendar', buildCalendar);
  await section(forms, 'File Upload', buildFileUploads);

  var data = group('Data display');
  built.badges = await section(data, 'Badge', buildBadges);
  await section(data, 'Tag', buildTags);
  await section(data, 'Avatar', buildAvatars);
  await section(data, 'Card', function () { return buildCards(built.buttons); });
  await section(data, 'Table', function () { return buildTables(built.badges); });
  await section(data, 'Pagination', buildPagination);
  await section(data, 'Accordion', buildAccordions);
  await section(data, 'Empty State', function () { return buildEmptyStates(built.buttons); });

  var feedback = group('Feedback');
  await section(feedback, 'Alert', buildAlerts);
  await section(feedback, 'Toast', buildToasts);
  await section(feedback, 'Progress', buildProgress);
  await section(feedback, 'Spinner', buildSpinners);
  await section(feedback, 'Skeleton', buildSkeletons);

  var overlay = group('Overlay');
  await section(overlay, 'Dialog', function () { return buildDialogs(built.buttons, built.inputs); });
  await section(overlay, 'Drawer', function () { return buildDrawers(built.buttons, built.inputs); });
  await section(overlay, 'Tooltip', buildTooltips);
  await section(overlay, 'Popover', function () { return buildPopovers(built.buttons, built.switches); });

  var navigation = group('Navigation');
  await section(navigation, 'Tabs', buildTabs);
  await section(navigation, 'Breadcrumb', buildBreadcrumbs);
  await section(navigation, 'Stepper', buildSteppers);

  var layout = group('Layout');
  await section(layout, 'Divider', buildDividers);

  figma.viewport.scrollAndZoomIntoView([root]);
  return { created: created, failed: failed };
}

/* ---------- main ---------- */

async function main() {
  await Promise.all(
    ['Regular', 'Medium', 'Semi Bold', 'Bold'].map(function (style) {
      return figma.loadFontAsync({ family: FONT_FAMILY, style: style });
    }),
  );

  await setupVariables();
  await setupStyles();

  // Page names are available without loading page contents
  var existingPage = figma.root.children.find(function (p) {
    return p.name === PAGE_NAME;
  });

  var notes = [];
  if (existingPage) {
    await figma.setCurrentPageAsync(existingPage);
    notes.push('Variables and styles updated (components page kept; delete "' + PAGE_NAME + '" to rebuild)');
  } else {
    var result = await buildComponentsPage();
    notes.push('Variables, styles and ' + result.created + ' components created');
    if (result.failed.length) {
      notes.push('Failed: ' + result.failed.join('; '));
      console.error('Design System Builder Importer failures:\n' + result.failed.join('\n'));
    }
  }
  if (!darkModeId) notes.push('Dark mode skipped: this plan allows one mode per collection');

  figma.closePlugin(notes.join(' · '));
}

main().catch(function (error) {
  figma.closePlugin('Import failed: ' + (error && error.message ? error.message : String(error)));
});
