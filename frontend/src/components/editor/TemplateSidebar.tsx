import React from "react";
import TemplateSelector, { TemplateKey } from "../TemplateSelector";

interface TemplateSidebarProps {
  selectedTemplate: TemplateKey;
  onTemplateChange: (template: TemplateKey) => void;
}

export default function TemplateSidebar({ selectedTemplate, onTemplateChange }: TemplateSidebarProps) {
  return (
    <div className="w-1/5 flex-shrink-0 hidden lg:block">
      <div className="sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">
        <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={onTemplateChange} />
      </div>
    </div>
  );
}


