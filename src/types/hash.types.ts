export interface HashFormData {
  file: File | null;
  description: string;
  hash?: string;
}

export interface HashFormProps {
  onSubmit?: (data: HashFormData) => void;
  addHash: (data: HashFormData) => void;
}

export interface HashHistoryProps {
  data: HashFormData[];
}

export interface HashProgressProps {
  isHashing: boolean;
  progress?: number;
}

export interface HashDetailsProps {
  formData: HashFormData;
}

export interface HashErrorProps {
  error: string;
  onRetry?: () => void;
  hasRetry?: boolean;
}
