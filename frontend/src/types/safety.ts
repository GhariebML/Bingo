export interface SafetyResources {
  region?: string;
  emergency?: string;
  crisis_line?: string;
  note?: string;
  [key: string]: string | undefined;
}

export interface SafetyDisclaimer {
  title: string;
  message: string;
  crisis_guidance: string;
  not_for: string[];
}
