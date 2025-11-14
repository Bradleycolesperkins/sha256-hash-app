export interface HashFormData {
  file: File | null;
  description: string;
  hash?: string;
}

export interface HashFormProps {
  onSubmit?: (data: HashFormData) => void;
}

export interface HashProgressProps {
  isHashing: boolean;
}
