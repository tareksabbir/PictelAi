  export const extractCode = (text: string): string => {
    const codeMatch = text.match(/```html\n?([\s\S]*?)```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }
    return text.replaceAll("```html", "").replaceAll("```", "").trim();
  };