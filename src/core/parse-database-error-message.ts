import { Prisma } from "../../generated/prisma";

export function parseDatabaseErrorMessage(err: unknown, entity: string) {
  let message = "Ocorreu um erro desconhecido no banco de dados";

  if (err instanceof Error && "message" in err) {
    message = err.message;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2001":
        message = `${entity} não existe`;
        break;

      case "P2002":
        message = `${entity} já existe`;
        break;

      case "P2003":
        message = `Relacionamento inválido para ${entity}`;
        break;

      case "P2005":
        message = `Existe um campo de ${entity} com tipo inválido`;
        break;

      case "P2011":
        message = `Não foi possível inserir nulo em um campo de ${entity}`;
        break;

      case "P2012":
        message = `Um campo obrigatório de ${entity} não foi enviado`;
        break;

      case "P2016":
        message = `A conexão demorou demais`;
        break;

      case "P2025":
        message = `${entity} não encontrado para a operação`;
        break;

      default:
        break;
    }
  }

  return message;
}
