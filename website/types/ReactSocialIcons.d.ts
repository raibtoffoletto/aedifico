declare module 'react-social-icons/build/_networks-db' {
  interface NetworkIcon {
    icon: string;
    mask: string;
    color: string;
  }

  export = Record<string, NetworkIcon>;
}
