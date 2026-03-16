import { Product } from "@/src/domains/product/types";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  editingProduct: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({}: ProductFormProps) {
  const { handleSubmit } = useForm();

  return <form onSubmit={handleSubmit(() => {})}></form>;
}
