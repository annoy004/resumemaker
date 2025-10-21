import ModernTemplate from "./ModernTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import ElegantTemplate from "./ElegantTemplate";

export const templates = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  elegant: ElegantTemplate,
};

export type TemplateKey = keyof typeof templates;
