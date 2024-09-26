import { StatCards } from "./StatCards";
import { ActivityGraph } from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import { RecentTransactions } from "./RecentTransactions";

export const Grid = () => {
  return (
    <div className="px-4 gap-3 grid grid-cols-12">
      <StatCards />
      <div className="col-span-12 lg:col-span-8">
        <ActivityGraph />
      </div>
      <div className="col-span-4">
        <UsageRadar />
      </div>
      <div className="col-span-8 lg:col-span-12">
        <RecentTransactions />
      </div>
    </div>
  );
};
