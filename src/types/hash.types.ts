export interface HashFormData {
  file: File | null;
  description: string;
}

export interface HashFormProps {
  onSubmit?: (data: HashFormData) => void;
}
