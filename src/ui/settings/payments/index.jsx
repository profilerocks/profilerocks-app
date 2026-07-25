import PolarShSettings from "#src/ui/settings/payments/polar";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsPayments() {
  return (
    <div id="payments">
      <h1 className="text-3xl">Payments</h1>
      <p className="my-4 text-zinc-200">
        Payments are processed through <strong>Polar.sh</strong>. You can manage your orders and subscriptions in their portal.
      </p>
      <PolarShSettings />
    </div>
  );
}
