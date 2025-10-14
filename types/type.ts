type Messages = {
  role: string;
  content: string;
};

type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type { Frame, Messages };