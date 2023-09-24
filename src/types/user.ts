export type User = {
  payload?: {
    data?: {
      role: string;
      id: string;
      email: string;
      address: string;
      phone_number: string;
    };
  };
};
