import { getStats } from './helpers';
import BarChart from './BarChart';

function Stats({ mode, result }) {
    const stats = getStats(mode);
    const total = stats[1] + stats[2] + stats[3] + stats[4] + stats[5] + stats[6] + stats.fail;
    return (
      <div className="Stats">
          <div className="Stats__kpis">
              <div className="Stats__kpi">
                  <div className="Stats__key">Total</div>
                  <div className="Stats__value">{total}</div>
              </div>
              <div className="Stats__kpi">
                  <div className="Stats__key">Failed</div>
                  <div className="Stats__value">{stats.fail}</div>
              </div>
              <div className="Stats__kpi">
                  <div className="Stats__key">Streak</div>
                  <div className="Stats__value">{stats.streak}</div>
              </div>
          </div>
          <BarChart stats={stats} result={result} />
      </div>
    );
}

export default Stats;
