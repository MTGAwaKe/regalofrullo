export type ToastState = { message: string; visible: boolean } | null;

export function RewardToast({ toast }: { toast: ToastState }) {
  return <div className={`reward-toast${toast?.visible ? ' show' : ''}`}>{toast?.message ?? ''}</div>;
}
