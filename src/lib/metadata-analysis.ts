import { analyzeMetadata as analyzeCoreMetadata } from 'linkglimpse/core/analysis';
import type { ApiResponse, DiagnosticReport } from '@/types';

export function analyzeMetadata(metadata: ApiResponse): DiagnosticReport {
  return analyzeCoreMetadata(metadata) as DiagnosticReport;
}
