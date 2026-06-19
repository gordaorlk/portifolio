export interface TemaConfig {
  bg: string;
  header: string;
  text_h: string;
  card: string;
  content_bg: string;
  content_text: string;
  lang: string;
  pasta: string;
  desc: string;
}

export type TemasObject = {
  [key: string]: TemaConfig;
};

export interface Projeto {
  nome: string;
  caminho_relativo: string;
  tipo: "imagem" | "codigo" | "texto" | "link";
  ext: string;
  conteudo: string;
}
