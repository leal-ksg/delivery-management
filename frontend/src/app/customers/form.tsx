import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { FormInput } from "@/src/components/FormInput";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/get-dirty-values";
import { ApiResponse } from "@/lib/api";
import { FormSwitch } from "@/src/components/FormSwitch";
import { Customer } from "@/src/domains/customer/types";
import { updateCustomer } from "@/src/domains/customer/services/update-customer";
import { createCustomer } from "@/src/domains/customer/services/create-customer";
import { FormSelect } from "@/src/components/FormSelect";
import { brazilStates } from "@/src/constants";
import { formatPhone } from "@/lib/format-phone";
import { useEffect } from "react";

interface CustomerFormProps {
  editingCustomer: Customer | null;
  onSuccess: () => void;
  onCancel: () => void;
}

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
  complement: z.string().optional(),
  active: z.boolean().optional(),
});

export const updateCustomerSchema = customerSchema.partial();

type FormData = z.input<typeof customerSchema>;

export function CustomerForm({
  editingCustomer,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingCustomer ?? undefined,
    resolver: zodResolver(customerSchema),
  });

  const { formState } = methods;

  async function onSubmit(data: FormData) {
    let response: ApiResponse<Customer>;

    if (editingCustomer) {
      const { dirtyFields } = formState;

      console.log(dirtyFields);

      const parsedData = customerSchema.parse(methods.getValues());
      const dirtyData = getDirtyValues(dirtyFields, parsedData);
      response = await updateCustomer(editingCustomer.id, dirtyData);
    } else {
      const parsedData = customerSchema.parse(data);
      response = await createCustomer(parsedData);
    }

    if (response.ok) {
      onSuccess();
    }
  }

  useEffect(() => {
    if (editingCustomer) {
      methods.reset(editingCustomer);
    }
  }, [editingCustomer, methods]);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full min-h-90 mt-10 gap-10"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormInput name="name" label="Nome" />

          <FormInput name="surname" label="Sobrenome" />

          <FormSwitch
            name="active"
            label="Ativo?"
            classname="md:ml-4 self-start md:self-center"
            disabled={!editingCustomer}
            defaultValue={true}
          />
        </div>

        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormInput name="city" label="Cidade" />

          <FormSelect
            options={brazilStates}
            name="state"
            label="Estado"
            placeholder="Selecione um estado"
          />

          <FormInput
            name="phone"
            label="Telefone"
            mask="(##) #####-####"
            unique
          />
        </div>

        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormInput name="street" label="Rua" />

          <FormInput className="w-1/3" name="streetNumber" label="Número" />
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <FormInput name="neighborhood" label="Bairro" />

          <FormInput name="complement" label="Complemento" />
        </div>

        <div className="flex self-end mt-10 md:mt-25 gap-2">
          <ActionButton
            onClick={onCancel}
            className="text-white bg-gray-500 hover:bg-gray-400 disabled:text-gray-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={formState.isSubmitting}
          >
            <span>Cancelar</span>

            <XCircle strokeWidth={3} />
          </ActionButton>

          <ActionButton
            className="text-white bg-green-600 hover:bg-green-500 disabled:text-green-600 disabled:bg-green-200 disabled:cursor-not-allowed"
            type="submit"
            disabled={formState.isSubmitting}
          >
            <span>Confirmar</span>

            {formState.isSubmitting ? (
              <Spinner />
            ) : (
              <CheckCircle strokeWidth={3} />
            )}
          </ActionButton>
        </div>
      </form>
    </FormProvider>
  );
}
