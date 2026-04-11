import * as z from "zod";

const phoneRegex = /^\d{2}9\d{8}$/;

export const customerSchema = z.object({
  name: z
    .string("Informe o nome do cliente")
    .min(1, "Informe o nome do cliente"),
  surname: z
    .string("Informe o sobrenome do cliente")
    .min(1, "Informe o sobrenome do cliente"),
  phone: z.string("Digite o telefone").regex(phoneRegex, "Telefone inválido"),
  street: z.string("Informe a rua").min(1, "Informe a rua"),
  streetNumber: z
    .string("Informe o número do endereço")
    .min(1, "Informe o número do endereço"),
  city: z.string("Informe a cidade").min(1, "Informe a cidade"),
  state: z.string("Informe o estado").min(1, "Informe o estado"),
  neighborhood: z.string("Informe o bairro").min(1, "Informe o bairro"),
  complement: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export const updateCustomerSchema = customerSchema.partial();
