// types/pdftojson.d.ts
declare module 'pdftojson' {
  export default function pdftojson(buffer: Buffer): Promise<{
    pages: Array<{
      texts: Array<{
        R: Array<{ T: string }>
      }>
    }>
  }>;
}
