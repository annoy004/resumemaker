import ModernTemplate from "./ModernTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ElegantTemplate from "./ElegantTemplate";

export const templates = {
  modern: ModernTemplate,
  creative: CreativeTemplate,
  elegant: ElegantTemplate,
};

export type TemplateKey = keyof typeof templates;
