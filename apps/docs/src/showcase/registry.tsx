import type { ComponentType } from 'react';
import {
  AppWindow,
  CalendarDays,
  ChevronRight,
  ChevronsUpDown,
  CircleUser,
  ClipboardList,
  Footprints,
  Inbox,
  Link,
  ListChevronsUpDown,
  Loader,
  MessageSquare,
  MessageSquareWarning,
  PanelRight,
  PanelTop,
  PanelsTopLeft,
  RectangleEllipsis,
  RectangleHorizontal,
  Search,
  SeparatorHorizontal,
  SlidersHorizontal,
  SquareCheck,
  SquareMousePointer,
  Table2,
  Tag,
  TextCursorInput,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { AccordionShowcase } from './AccordionShowcase';
import { AlertShowcase } from './AlertShowcase';
import { AvatarShowcase } from './AvatarShowcase';
import { BadgeShowcase } from './BadgeShowcase';
import { BreadcrumbShowcase } from './BreadcrumbShowcase';
import { ButtonShowcase } from './ButtonShowcase';
import { CardShowcase } from './CardShowcase';
import { ChoiceShowcase } from './ChoiceShowcase';
import { ComboboxShowcase } from './ComboboxShowcase';
import { DatePickerShowcase } from './DatePickerShowcase';
import { DialogShowcase } from './DialogShowcase';
import { DividerShowcase } from './DividerShowcase';
import { DrawerShowcase } from './DrawerShowcase';
import { EmptyStateShowcase } from './EmptyStateShowcase';
import { FieldShowcase } from './FieldShowcase';
import { FileUploadShowcase } from './FileUploadShowcase';
import { IconButtonShowcase } from './IconButtonShowcase';
import { InputShowcase } from './InputShowcase';
import { LinkShowcase } from './LinkShowcase';
import { ProgressShowcase } from './ProgressShowcase';
import { SelectShowcase } from './SelectShowcase';
import { SkeletonShowcase } from './SkeletonShowcase';
import { SliderShowcase } from './SliderShowcase';
import { StepperShowcase } from './StepperShowcase';
import { TableShowcase } from './TableShowcase';
import { TabsShowcase } from './TabsShowcase';
import { TooltipShowcase } from './TooltipShowcase';

export interface ShowcaseEntry {
  id: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}

export interface ShowcaseGroup {
  title: string;
  items: ShowcaseEntry[];
}

export const showcaseGroups: ShowcaseGroup[] = [
  {
    title: 'Actions',
    items: [
      { id: 'button', label: 'Button', icon: RectangleHorizontal, component: ButtonShowcase },
      { id: 'icon-button', label: 'Icon Button / Group', icon: SquareMousePointer, component: IconButtonShowcase },
      { id: 'link', label: 'Link', icon: Link, component: LinkShowcase },
    ],
  },
  {
    title: 'Forms',
    items: [
      { id: 'field', label: 'Form Field', icon: ClipboardList, component: FieldShowcase },
      { id: 'input', label: 'Input / Textarea', icon: TextCursorInput, component: InputShowcase },
      { id: 'choice', label: 'Checkbox / Radio / Switch', icon: SquareCheck, component: ChoiceShowcase },
      { id: 'select', label: 'Select / Dropdown', icon: ChevronsUpDown, component: SelectShowcase },
      { id: 'combobox', label: 'Combobox', icon: Search, component: ComboboxShowcase },
      { id: 'slider', label: 'Slider', icon: SlidersHorizontal, component: SliderShowcase },
      { id: 'date-picker', label: 'Date Picker', icon: CalendarDays, component: DatePickerShowcase },
      { id: 'file-upload', label: 'File Upload', icon: Upload, component: FileUploadShowcase },
    ],
  },
  {
    title: 'Data display',
    items: [
      { id: 'badge', label: 'Badge / Tag', icon: Tag, component: BadgeShowcase },
      { id: 'avatar', label: 'Avatar', icon: CircleUser, component: AvatarShowcase },
      { id: 'card', label: 'Card', icon: PanelTop, component: CardShowcase },
      { id: 'table', label: 'Table / Pagination', icon: Table2, component: TableShowcase },
      { id: 'accordion', label: 'Accordion', icon: ListChevronsUpDown, component: AccordionShowcase },
      { id: 'empty-state', label: 'Empty State', icon: Inbox, component: EmptyStateShowcase },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert / Toast', icon: MessageSquareWarning, component: AlertShowcase },
      { id: 'progress', label: 'Progress / Spinner', icon: Loader, component: ProgressShowcase },
      { id: 'skeleton', label: 'Skeleton', icon: RectangleEllipsis, component: SkeletonShowcase },
    ],
  },
  {
    title: 'Overlay',
    items: [
      { id: 'dialog', label: 'Modal / Dialog', icon: AppWindow, component: DialogShowcase },
      { id: 'drawer', label: 'Drawer / Sheet', icon: PanelRight, component: DrawerShowcase },
      { id: 'tooltip', label: 'Tooltip / Popover', icon: MessageSquare, component: TooltipShowcase },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { id: 'tabs', label: 'Tabs', icon: PanelsTopLeft, component: TabsShowcase },
      { id: 'breadcrumb', label: 'Breadcrumb', icon: ChevronRight, component: BreadcrumbShowcase },
      { id: 'stepper', label: 'Stepper', icon: Footprints, component: StepperShowcase },
    ],
  },
  {
    title: 'Layout',
    items: [{ id: 'divider', label: 'Divider', icon: SeparatorHorizontal, component: DividerShowcase }],
  },
];

export const showcases: ShowcaseEntry[] = showcaseGroups.flatMap((g) => g.items);
