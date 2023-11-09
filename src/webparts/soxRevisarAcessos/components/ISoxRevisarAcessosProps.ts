import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISoxRevisarAcessosProps {
  description: string;
  context: WebPartContext;
  siteurl: string;
  tipoVisualizacao: string
}
