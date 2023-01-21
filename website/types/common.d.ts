interface IParent {
  children: React.ReactNode;
}

interface IDictionary {
  [k: string]: any;
}

type TProps = IParent & IDictionary;

interface IPageFile {
  path: string;
  file: string;
}

interface IPageCache {
  paths: string[];
  pages: IPageFile[];
}

interface IContentFile extends IPageFile, IDictionary {
  date: Date;
  year: number;
  month: number;
  content: string;
}

interface IPostCache {
  paths: string[];
  posts: IContentFile[];
}

type TDictionary = Record<string, string>;

type TPostMonth = Record<number, TDictionary>;

type TPostTree = Record<number, TPostMonth>;
