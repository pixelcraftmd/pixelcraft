export type InvoiceStatus = 'pending' | 'paid';
export type ProjectStatus = 'planning' | 'in_progress' | 'testing' | 'done';

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, { ru: string; en: string; ro: string }> = {
  pending: { ru: 'Ожидает оплаты', en: 'Awaiting payment', ro: 'În așteptarea plății' },
  paid: { ru: 'Оплачен', en: 'Paid', ro: 'Plătit' }
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, { ru: string; en: string; ro: string }> = {
  planning: { ru: 'Планирование', en: 'Planning', ro: 'Planificare' },
  in_progress: { ru: 'В разработке', en: 'In progress', ro: 'În dezvoltare' },
  testing: { ru: 'На тестировании', en: 'Testing', ro: 'În testare' },
  done: { ru: 'Выполнено', en: 'Completed', ro: 'Finalizat' }
};

const matchByLabel = <T extends string>(
  value: string,
  labels: Record<T, { ru: string; en: string; ro: string }>
): T | null => {
  const normalized = value.trim().toLowerCase();
  const entry = (Object.keys(labels) as T[]).find(key => {
    const label = labels[key];
    return (
      label.ru.toLowerCase() === normalized ||
      label.en.toLowerCase() === normalized ||
      label.ro.toLowerCase() === normalized ||
      key === normalized
    );
  });
  return entry || null;
};

export const matchInvoiceStatus = (value: string): InvoiceStatus | null =>
  matchByLabel(value, INVOICE_STATUS_LABELS);

export const matchProjectStatus = (value: string): ProjectStatus | null =>
  matchByLabel(value, PROJECT_STATUS_LABELS);

export const normalizeInvoiceStatus = (value: string): InvoiceStatus =>
  matchInvoiceStatus(value) || 'pending';

export const normalizeProjectStatus = (value: string): ProjectStatus =>
  matchProjectStatus(value) || 'planning';

export const getInvoiceStatusLabels = () => INVOICE_STATUS_LABELS;
export const getProjectStatusLabels = () => PROJECT_STATUS_LABELS;
