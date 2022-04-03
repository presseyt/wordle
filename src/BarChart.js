function Bar({ label, count, max, green }) {
    return (
        <div className="BarChart__row">
            <div className="BarChart__label">{label}</div>
            <div className={green ? 'BarChart__bar green' : 'BarChart__bar'} style={{ width: `${100 * count / max}%` }}>{count}</div>
        </div>
    );
}

function BarChart({ stats, result }) {
    const max = Math.max(stats[1], stats[2], stats[3], stats[4], stats[5], stats[6]);
    return (
        <div className="BarChart">
            {[1, 2, 3, 4, 5, 6].map(x => (
                <Bar key={x} label={x} count={stats[x]} max={max} green={x === result} />
            ))}
        </div>
    );
}

export default BarChart;
