# Design System Builder

브라우저에서 **디자인 토큰을 직접 커스터마이징**하고, 그 결과를 **Figma · HTML/CSS · npm 패키지(React 컴포넌트 포함)** 로 내보내는 디자인 시스템 빌더입니다.

색상, 타이포그래피, 크기, 여백, 모서리, 테두리, 그림자, 모션, 포커스 링을 **Light / Dark 모드별로** 조정하면 27종의 컴포넌트에 즉시 반영되고, 버튼 한 번으로 디자이너(Figma)와 개발자(npm, CSS)가 바로 쓸 수 있는 결과물을 만들어 줍니다.

---

## 목차

- [주요 기능](#주요-기능)
- [빠른 시작](#빠른-시작)
- [사용 방법](#사용-방법)
  - [1. Settings: 토큰 커스터마이징](#1-settings-토큰-커스터마이징)
  - [2. Light / Dark 모드](#2-light--dark-모드)
  - [3. Components: 컴포넌트 미리보기](#3-components-컴포넌트-미리보기)
  - [4. Export: 결과물 내보내기](#4-export-결과물-내보내기)
- [Export 상세](#export-상세)
  - [Figma](#figma)
  - [HTML, CSS](#html-css)
  - [JSON · npm 패키지](#json--npm-패키지)
- [내보낸 npm 패키지 사용하기](#내보낸-npm-패키지-사용하기)
- [토큰 레퍼런스](#토큰-레퍼런스)
- [프로젝트 구조](#프로젝트-구조)
- [아키텍처](#아키텍처)
- [개발 가이드](#개발-가이드)
- [알려진 제한사항](#알려진-제한사항)
- [라이선스](#라이선스)

---

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 🎨 **토큰 편집기** | Color, Text, Size, Spacing, Radius, Border, Shadow, Motion, Focus ring 9개 섹션을 모달에서 슬라이더·컬러 피커·셀렉트로 조정 |
| 🌗 **Light / Dark 모드** | 모든 섹션이 모드별로 독립된 값을 가짐. 모달 헤더나 사이드바에서 모드를 바꿔 가며 편집 |
| 🧩 **27종 컴포넌트** | Button부터 Date Picker, Table, Drawer까지 실시간으로 토큰이 반영되는 React 컴포넌트 갤러리 |
| 🖌️ **Figma Export** | 변수(Light/Dark 모드), 텍스트·이펙트 스타일, **모든 컴포넌트**를 생성하는 Figma 플러그인 + DTCG 토큰 파일 |
| 🌐 **HTML / CSS Export** | `tokens.css`, `components.css`, 모든 컴포넌트를 담은 정적 `components.html` |
| 📦 **npm 패키지 Export** | 토큰 + React 컴포넌트 + 타입 정의가 들어 있는 **바로 `npm publish` 가능한 패키지** |
| ♿ **접근성** | 네이티브 요소 기반(dialog, input, select), 키보드 내비게이션, ARIA 속성, `:focus-visible` 포커스 링, `prefers-reduced-motion` 대응 |

---

## 빠른 시작

### 요구 사항

- **Node.js 20.19+ 또는 22.12+** (Vite 7 요구 사항)
- npm 10+

### 설치 및 실행

```bash
git clone https://github.com/Mithpasong/design-system-builder.git
cd design-system-builder
npm install
npm run dev
```

브라우저에서 터미널에 표시되는 주소(기본 `http://localhost:5173`)를 엽니다.

> `npm run dev` / `npm run build`는 실행 전에 React 컴포넌트 라이브러리(`packages/react`)를 자동으로 먼저 빌드합니다. npm 패키지 Export가 이 빌드 결과물을 사용하기 때문입니다.

### 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 컴포넌트 라이브러리를 빌드한 뒤 문서 사이트 개발 서버 실행 |
| `npm run build` | 컴포넌트 라이브러리 + 문서 사이트 프로덕션 빌드 (`apps/docs/dist`) |
| `npm run preview` | 빌드된 사이트 미리보기 |
| `npm run build -w @design-token/react` | 컴포넌트 라이브러리만 빌드 (`packages/react/dist`) |

---

## 사용 방법

화면은 **왼쪽 사이드바**(모드 전환 · Settings · Components · Export)와 **오른쪽 캔버스**(선택한 컴포넌트 미리보기)로 구성됩니다.

### 1. Settings: 토큰 커스터마이징

사이드바의 **SETTINGS** 항목을 누르면 각 섹션의 편집 모달이 열립니다. 모달 오른쪽에는 해당 모드의 배경 위에서 결과를 보여주는 미리보기가 있습니다.

| 섹션 | 조정 항목 | 생성되는 CSS 변수 |
| --- | --- | --- |
| **Color** | Brand(primary, secondary), Status(success, warning, danger, info), Neutral(background, surface, border, text, text muted) | `--dt-primary`, `--dt-primary-foreground`, `--dt-surface` … |
| **Text** | 기본 글자 크기, 스케일 비율(Major Second ~ Perfect Fourth), 4가지 굵기 | `--dt-font-size-{xs…4xl}`, `--dt-line-height-*`, `--dt-font-weight-*` |
| **Size** | 컴포넌트 크기 xs ~ xl의 높이와 좌우 패딩 | `--dt-size-{xs…xl}-height`, `--dt-size-*-padding-x` |
| **Spacing** | 기본 단위(base)와 단계별 배수 | `--dt-space-{xs…3xl}` |
| **Radius** | sm, md, lg 모서리 반경 | `--dt-radius-{sm,md,lg}`, `--dt-radius-full` |
| **Border** | 테두리 색상, sm/md/lg 두께 | `--dt-border`, `--dt-border-width-*` |
| **Shadow** | 그림자 색·투명도, 단계별 Y 오프셋과 블러 | `--dt-shadow-{sm,md,lg,xl}` |
| **Motion** | fast/normal/slow 지속 시간, easing 곡선 | `--dt-duration-*`, `--dt-easing` |
| **Focus ring** | 포커스 링 색상, 두께, 간격 | `--dt-focus-ring-{color,width,offset}` |

- **글자색 자동 계산**: brand/status 색상마다 대비가 더 높은 글자색(흑/백)이 `-foreground` 변수로 자동 생성됩니다.
- **리셋**: 각 모달의 `Reset {mode} to defaults`는 현재 모드의 해당 섹션만, SETTINGS 제목 옆 `Reset`은 **모든 모드의 모든 섹션**을 기본값으로 되돌립니다.

### 2. Light / Dark 모드

- 사이드바 상단과 모든 Settings 모달 헤더에 **Light / Dark 토글**이 있습니다.
- 모달에서 바꾸는 값은 **현재 선택된 모드에만** 저장됩니다. 예를 들어 Dark에서 Radius를 바꾸면 Light의 Radius는 그대로입니다.
- 캔버스와 미리보기는 선택된 모드로 즉시 렌더링됩니다.

### 3. Components: 컴포넌트 미리보기

사이드바 **COMPONENTS**에서 컴포넌트를 고르면 캔버스에 모든 variant·크기·상태가 표시됩니다. 토큰을 바꾸면 바로 반영됩니다.

| 분류 | 컴포넌트 |
| --- | --- |
| **Actions** | Button, Icon Button / Button Group, Link |
| **Forms** | Form Field, Input / Textarea, Checkbox / Radio / Switch, Select / Dropdown, Combobox, Slider, Date Picker, File Upload |
| **Data display** | Badge / Tag, Avatar, Card, Table / Pagination, Accordion, Empty State |
| **Feedback** | Alert / Toast, Progress / Spinner, Skeleton |
| **Overlay** | Modal / Dialog, Drawer / Sheet, Tooltip / Popover |
| **Navigation** | Tabs, Breadcrumb, Stepper |
| **Layout** | Divider |

### 4. Export: 결과물 내보내기

사이드바 맨 아래 검은색 **Export** 버튼을 누르면 세 가지 선택지가 나옵니다. 모든 Export에는 **현재 설정의 Light와 Dark 두 모드가 함께** 들어갑니다.

| 선택지 | 다운로드 | 대상 |
| --- | --- | --- |
| **Figma** | `design-tokens-figma.zip` | 디자이너 |
| **HTML, CSS** | `design-tokens-css.zip` | 퍼블리셔, 웹 개발자 |
| **JSON · npm package** | `{패키지명}-{버전}.zip` | React 개발자, 디자인 시스템 배포 |

---

## Export 상세

### Figma

```
design-tokens-figma.zip
├── plugin/
│   ├── manifest.json      # Figma 개발 플러그인
│   └── code.js            # 토큰 값이 내장된 플러그인 코드
├── Light.tokens.json      # DTCG 형식 토큰 (Light)
├── Dark.tokens.json       # DTCG 형식 토큰 (Dark)
└── README.md
```

#### 방법 1: 플러그인 (변수 + 스타일 + 컴포넌트, 권장)

Figma **데스크톱 앱**이 필요합니다.

1. `Plugins → Development → Import plugin from manifest…` 에서 `plugin/manifest.json` 선택 (최초 1회)
2. 대상 파일을 열고 `Plugins → Development → Design System Builder Importer` 실행

플러그인이 만드는 것:

- **Variables**: `Design Tokens` 컬렉션, `Light` / `Dark` 모드, 77개 변수 (`color/brand/primary`, `space/md`, `radius/lg` …). 용도별 scope 지정
- **Text styles**: `Text/xs` ~ `Text/4xl` (글자 크기·행간이 변수에 연결)
- **Effect styles**: `Shadow/sm` ~ `Shadow/xl`
- **`Design Tokens · Components` 페이지**: 문서 사이트와 같은 분류로 **38개 섹션의 컴포넌트 세트**. 색·크기·여백·모서리·테두리가 모두 변수에 바인딩되고, Card·Table·Dialog 등은 Button·Badge·Input 등의 **인스턴스**로 구성

다시 실행할 때:

- 변수와 스타일은 **이름으로 찾아 값만 업데이트**합니다. 컴포넌트가 변수에 연결되어 있으므로 기존 인스턴스까지 새 값이 반영됩니다.
- 컴포넌트 페이지가 이미 있으면 **다시 만들지 않습니다**(사용 중인 인스턴스 연결 보호). 컴포넌트를 새로 만들려면 페이지를 삭제하고 실행하세요.
- 한 섹션에서 오류가 나도 나머지 섹션은 계속 만들고, 실패한 섹션은 종료 알림과 콘솔에 표시됩니다.
- 컬렉션당 모드를 하나만 허용하는 요금제에서는 Dark 모드를 건너뛰고 알려 줍니다.

#### 방법 2: 토큰만 가져오기 (플러그인 없이)

`Light.tokens.json`, `Dark.tokens.json`은 W3C **DTCG** 형식이라 Figma의 기본 변수 가져오기로 불러올 수 있습니다.

- 새 컬렉션: Local variables → Import에서 **두 파일을 함께** 선택 → 파일마다 모드가 하나씩 생성
- 기존 컬렉션 업데이트: 모드 이름 우클릭 → Import mode

Figma 변수 타입 제약 때문에 그림자는 `y` / `blur` 숫자와 색·투명도로 나뉘고, easing 곡선은 포함되지 않습니다.

### HTML, CSS

```
design-tokens-css.zip
├── tokens.css          # 모든 토큰 CSS 변수 (light 기본, dark, prefers-color-scheme)
├── components.css      # 모든 컴포넌트 스타일 (dt-* 클래스)
├── components.html     # 모든 컴포넌트를 담은 정적 문서 페이지
├── index.html          # 토큰 미리보기 페이지 (색, 타이포, 여백, 그림자)
└── README.md
```

- `tokens.css`는 `:root`에 Light, `[data-theme="dark"]`에 Dark, 그리고 OS 다크 모드용 `@media (prefers-color-scheme: dark)` 블록을 포함합니다.
- `components.html`은 실제 React 컴포넌트를 정적 HTML로 렌더링한 결과입니다. 문서 사이트와 같은 레이아웃이며, Dialog·Drawer는 인라인으로 펼쳐져 있고 **Open states** 섹션에서 Tooltip·Dropdown·Popover·Combobox·Date Picker의 열린 상태를 볼 수 있습니다.
- 마크업은 정적입니다. 컴포넌트의 HTML을 복사해 `dt-*` 클래스를 유지하면 같은 모양이 나오지만, 메뉴 열기·탭 전환 같은 동작은 React 패키지에서 제공됩니다.

### JSON · npm 패키지

Export 모달에서 **패키지 이름**(예: `@acme/design-tokens`)과 **버전**(예: `1.0.0`)을 입력하면 바로 배포할 수 있는 패키지가 만들어집니다. 이름은 npm 규칙으로 검증되고, 마지막 입력값은 브라우저에 기억됩니다.

```
acme-design-tokens/
├── package.json        # exports, peerDependencies(react >= 18), files, sideEffects
├── tokens.json         # 두 모드의 최종 값 + CSS 변수 맵
├── tokens.css          # CSS 변수
├── index.js            # 토큰 (ESM)
├── index.cjs           # 토큰 (CommonJS)
├── index.d.ts          # 토큰 타입
├── components/         # React 컴포넌트 (ESM, 'use client') + 타입 정의
├── components.css      # 컴포넌트 스타일
└── README.md           # 설치 · 사용 · 커스터마이징 · 배포 가이드
```

배포:

```bash
cd acme-design-tokens
npm login
npm publish --access public   # scoped 패키지를 처음 공개 배포할 때 --access public 필요
```

업데이트할 때는 사이트에서 다시 커스터마이징 → 더 높은 버전으로 Export → 파일 교체 → `npm publish`.

---

## 내보낸 npm 패키지 사용하기

```bash
npm install @acme/design-tokens
```

```tsx
import '@acme/design-tokens/tokens.css';
import '@acme/design-tokens/components.css';
import { Button, Card, CardBody, CardHeader, CardTitle, Field, Input } from '@acme/design-tokens/components';

export function SignIn() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardBody>
        <Field label="Email" required>
          <Input type="email" placeholder="name@company.com" />
        </Field>
        <Button>Continue</Button>
      </CardBody>
    </Card>
  );
}
```

토큰 값을 JS에서 쓰기:

```ts
import tokens, { light, dark } from '@acme/design-tokens';

light.color.primary;      // "#000000"
dark.space.md;            // "12px"
tokens.cssVariables.dark; // { "--dt-primary": "#ffffff", ... }
```

### 프로젝트에서 디자인 다시 커스터마이징하기

모든 컴포넌트는 값을 하드코딩하지 않고 `--dt-*` CSS 변수를 읽습니다. 덮어쓰는 CSS는 `tokens.css`, `components.css` **다음에** 불러오세요.

| 범위 | 방법 | 예시 |
| --- | --- | --- |
| 전체 | `:root`에서 변수 덮어쓰기 | `:root { --dt-primary: #2563eb; }` |
| 다크 모드만 | `[data-theme='dark']` | `[data-theme='dark'] { --dt-primary: #60a5fa; }` |
| 특정 영역 | 감싸는 요소에 변수 지정 | `.marketing { --dt-radius-md: 999px; }` |
| 인스턴스 하나 | `className`, `style` prop | `<Button style={{ '--dt-size-md-height': '52px' }}>` |
| 컴포넌트 일부 | 고정 클래스 이름 | `.dt-card-title { font-weight: 700; }` |
| 나만의 변형 | 컴포넌트 감싸기 | `const DangerButton = (p) => <Button color="danger" {...p} />` |

클래스 이름 규칙은 `dt-{컴포넌트}`와 `dt-{컴포넌트}-{부분}`입니다(예: `dt-button`, `dt-button-solid`, `dt-button-size-md`, `dt-dialog-panel`).

---

## 토큰 레퍼런스

기본값(Light) 기준입니다. 모든 변수는 `--dt-` 접두사를 사용합니다.

| 그룹 | 변수 | 기본값 |
| --- | --- | --- |
| Brand | `--dt-primary`, `--dt-secondary` (+ `-foreground`) | `#000000`, `#7c3aed` |
| Status | `--dt-success`, `--dt-warning`, `--dt-danger`, `--dt-info` (+ `-foreground`) | `#16a34a`, `#f59e0b`, `#dc2626`, `#0284c7` |
| Neutral | `--dt-background`, `--dt-surface`, `--dt-border`, `--dt-text`, `--dt-text-muted` | `#f4f4f5`, `#ffffff`, `#e4e4e7`, `#18181b`, `#71717a` |
| Font size | `--dt-font-size-{xs, sm, md, lg, xl, 2xl, 3xl, 4xl}` | md = 14px, 비율 1.2 |
| Line height | `--dt-line-height-*` | 20px 이하 ×1.5, 그 이상 ×1.25 |
| Font weight | `--dt-font-weight-{regular, medium, semibold, bold}` | 400, 500, 600, 700 |
| Size | `--dt-size-{xs…xl}-height`, `--dt-size-{xs…xl}-padding-x` | 24 / 32 / 40 / 48 / 56px |
| Spacing | `--dt-space-{xs, sm, md, lg, xl, 2xl, 3xl}` | base 4px × 1, 2, 3, 4, 6, 8, 12 |
| Radius | `--dt-radius-{sm, md, lg, full}` | 4, 8, 12, 9999px |
| Border width | `--dt-border-width-{sm, md, lg}` | 1, 2, 4px |
| Shadow | `--dt-shadow-{sm, md, lg, xl}` | Y 1/4/8/16, blur 2/8/24/48, 12% |
| Motion | `--dt-duration-{fast, normal, slow}`, `--dt-easing` | 100 / 200 / 300ms, `cubic-bezier(0.2, 0, 0, 1)` |
| Focus ring | `--dt-focus-ring-{color, width, offset}` | `#3b82f6`, 2px, 2px |

Dark 모드 기본값은 어두운 neutral, 흰색 primary, 더 밝은 status 색상, 더 진한 그림자(40%), 밝은 파랑 포커스 링을 사용합니다.

---

## 프로젝트 구조

npm workspaces 기반 모노레포입니다.

```
design-system-builder/
├── packages/
│   ├── tokens/                  # @design-token/tokens: 토큰 모델과 계산 로직
│   │   └── src/index.ts         # Theme 타입, defaultThemes, 타입 스케일, getCssVariables, applyTheme
│   └── react/                   # @design-token/react: React 컴포넌트 라이브러리
│       ├── src/
│       │   ├── Button/          # Button.tsx + Button.module.css (컴포넌트마다 폴더)
│       │   ├── …                # Input, Choice, Select, Menu, Combobox, Slider, DatePicker, …
│       │   ├── shared.ts        # Size, Color 타입, cx(), colorVars()
│       │   ├── icons.tsx        # 공용 SVG 아이콘
│       │   └── index.ts         # 공개 API
│       ├── css-scope.ts         # CSS 모듈 클래스 이름 규칙 (dt-*)
│       ├── vite.config.ts       # 라이브러리 빌드 (dist/index.js, dist/components.css)
│       └── tsconfig.build.json  # 타입 정의 생성 (dist/types)
├── apps/
│   └── docs/                    # 빌더 웹 앱 (Vite + React)
│       └── src/
│           ├── App.tsx          # 레이아웃, 사이드바, 모달 연결
│           ├── settings/        # ThemeContext, 섹션별 설정 모달, ModeToggle, 공용 입력 컨트롤
│           ├── showcase/        # 컴포넌트별 쇼케이스 + registry.tsx (메뉴 분류)
│           └── export/
│               ├── ExportModal.tsx      # Export UI
│               ├── formats.ts           # DTCG, CSS, JSON, Figma zip 구성
│               ├── htmlExport.tsx       # components.html / components.css 정적 렌더링
│               ├── npmPackage.ts        # npm 패키지 생성 (package.json, d.ts, README)
│               ├── zip.ts               # 의존성 없는 ZIP 작성기
│               └── figma-plugin/code.js # Figma 플러그인 본체
├── package.json                 # workspaces, 루트 스크립트
└── tsconfig.base.json
```

---

## 아키텍처

### 토큰 흐름

```
ThemeContext (light/dark Theme 상태)
   │ 편집: Settings 모달 → setSection / setColor (현재 모드만)
   ▼
getCssVariables(theme)  ── packages/tokens
   │
   ├─▶ applyTheme(): document.documentElement 에 --dt-* 설정 → 화면의 모든 컴포넌트 즉시 반영
   └─▶ Export: tokens.css / tokens.json / DTCG / Figma 플러그인 데이터
```

- `Theme`은 brand, status, neutral, typography, size, radius, border, shadow, spacing, motion, focusRing 섹션으로 구성됩니다.
- 화면 적용과 모든 Export가 **같은 `getCssVariables()`** 를 사용하므로 미리보기와 결과물이 항상 일치합니다.

### 컴포넌트

- 스타일은 CSS Modules로 작성하고, 모든 값은 `var(--dt-*, fallback)` 형태로 토큰을 참조합니다. 토큰이 없어도 기본 모양이 유지됩니다.
- 색상 variant는 `colorVars(color)`가 `--_c`(강조색)와 `--_fg`(글자색) 로컬 변수를 지정하고, CSS가 이를 사용합니다.
- CSS 모듈 클래스 이름은 [`css-scope.ts`](packages/react/css-scope.ts)의 규칙으로 `dt-{component}-{class}` 형태가 됩니다. 문서 사이트, 라이브러리 빌드, HTML Export가 같은 규칙을 공유합니다.
- 오버레이(Dialog, Drawer)는 네이티브 `<dialog>`를 사용해 포커스 트랩, Esc 닫기, top layer를 브라우저에 맡깁니다.

### Export 파이프라인

| Export | 구현 |
| --- | --- |
| Figma | `formats.ts`가 테마를 DTCG로 변환하고, 평탄화한 변수 목록을 `figma-plugin/code.js` 앞에 `TOKENS`로 주입. 플러그인은 Figma Plugin API로 변수·스타일·컴포넌트 생성 |
| HTML, CSS | `htmlExport.tsx`가 쇼케이스를 `react-dom/server`로 정적 렌더링하고, 컴포넌트 CSS는 `import.meta.glob(…?inline)`로 수집 (Export 시점에만 동적 로드) |
| npm 패키지 | `packages/react/dist` 빌드 결과물을 `import.meta.glob(…?raw)`로 포함하고, 토큰 파일·`package.json`·`index.d.ts`·README를 생성 |
| ZIP | `zip.ts`의 STORE 방식 ZIP 작성기(CRC32 포함). 외부 라이브러리 없음 |

---

## 개발 가이드

### 새 컴포넌트 추가하기

1. **컴포넌트**: `packages/react/src/{Name}/{Name}.tsx`와 `{Name}.module.css`를 만듭니다.
   - 값은 토큰 변수를 사용합니다: `var(--dt-space-md, 12px)`
   - 포커스 스타일은 `--dt-focus-ring-*`, 애니메이션은 `--dt-duration-*`, `--dt-easing`을 사용합니다.
   - `className`, `style` 등 네이티브 props를 전달해 사용자가 커스터마이징할 수 있게 합니다.
2. **공개 API**: `packages/react/src/index.ts`에 컴포넌트와 타입을 export합니다.
3. **쇼케이스**: `apps/docs/src/showcase/{Name}Showcase.tsx`를 만들고 `registry.tsx`의 알맞은 분류에 등록합니다. HTML Export에도 자동으로 포함됩니다.
4. **Figma**: `figma-plugin/code.js`에 `build{Name}()` 빌더를 추가하고 `buildComponentsPage()`에 섹션을 등록합니다. 기존 헬퍼(`component`, `frame`, `text`, `fill`, `stroke`, `radius`, `padX`, `gap`, `instanceOf`)를 사용하면 변수 바인딩이 자동으로 됩니다.
5. **확인**: `npm run build`로 타입 체크와 빌드를 확인합니다.

### 새 토큰 추가하기

1. `packages/tokens/src/index.ts`의 `Theme`, `defaultTheme`, `defaultThemes.dark`에 값을 추가합니다.
2. `getCssVariables()`에 CSS 변수 매핑을 추가합니다.
3. `apps/docs/src/settings/`에 편집 UI를 추가하고 `App.tsx`의 `settingsMenu`에 등록합니다.
4. Figma에도 반영하려면 `formats.ts`의 `toDtcg()`에 토큰을 추가합니다.

### 코드 컨벤션

- TypeScript strict, `verbatimModuleSyntax`, 미사용 변수 금지
- 컴포넌트 CSS는 CSS Modules, 문서 사이트 UI는 `apps/docs/src/index.css`
- Figma 플러그인 코드는 모든 Figma 샌드박스에서 실행되도록 ES2017 문법만 사용 (`?.`, `??`, 객체 spread 미사용)

---

## 알려진 제한사항

- **저장**: 설정은 브라우저 메모리에만 있어 새로고침하면 초기화됩니다. 결과물은 Export로 보관하세요.
- **Figma**: 플러그인은 데스크톱 앱에서 실행해야 하며, 컴포넌트는 Inter 폰트로 만들어집니다. 그림자 전체와 easing은 변수 타입이 없어 분리되거나 제외됩니다.
- **HTML Export**: 정적 마크업이라 탭 전환, 메뉴 열기, 토스트 같은 동작은 없습니다.
- **npm 패키지**: 컴포넌트는 ESM 전용입니다(토큰은 CommonJS도 지원). 일부 크기(Badge 높이, Avatar 크기, Checkbox 18px 등)는 토큰이 아닌 고정값이라 클래스 이름으로 덮어써야 합니다.
- **컴포넌트**: Select는 네이티브 목록을 사용하고, Tooltip·Popover·Dropdown은 화면 가장자리에서 자동으로 방향을 바꾸지 않습니다. Slider는 단일 값만 지원합니다. Table 정렬은 전달된 행 안에서만 동작합니다.

---

## 라이선스

[MIT](LICENSE) © 2026 Mithpasong

Export로 만든 결과물(npm 패키지, CSS, Figma 플러그인)에는 이 저장소의 컴포넌트 코드가 포함되며 동일하게 MIT 라이선스를 따릅니다.
