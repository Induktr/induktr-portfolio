export type CopyClipBoard = {
  copied: string | null;
  copyToClipboard: (text: string, type: string) => void;
}
