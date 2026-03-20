declare global {
  interface Window {
    Comunica: typeof import('@comunica/query-sparql');
  }
}

export {};