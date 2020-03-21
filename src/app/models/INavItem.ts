//https://stackblitz.com/edit/angular-side-nav-dynamic-expansive-menu

export interface INavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: INavItem[];
}