    import { useState, useMemo } from "react";
    import { 
    PieChart, 
    Pie, 
    Tooltip, 
    Cell, 
    Legend, 
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    Area,
    AreaChart
    } from "recharts";
    import styled, { keyframes } from "styled-components";

    // Colors
    const COLORS = [
    "#667eea", "#764ba2", "#f093fb", "#4facfe",
    "#43e97b", "#fa709a", "#fee140", "#30cfd0",
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#f38181"
    ];

    // Animations
    const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
    `;

    const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    `;

    const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
    `;

    const pulse = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    `;

    // Styled Components
    const ChartContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: ${fadeIn} 0.6s ease-out;
    `;

    const ViewToggle = styled.div`
    display: flex;
    gap: 8px;
    background: rgba(102, 126, 234, 0.08);
    padding: 6px;
    border-radius: 12px;
    width: fit-content;
    margin-bottom: 12px;
    `;

    const ToggleButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent'};
    color: ${props => props.active ? 'white' : '#666'};
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
        background: ${props => props.active 
        ? 'linear-gradient(135deg, #764ba2, #667eea)' 
        : 'rgba(102, 126, 234, 0.1)'};
        transform: translateY(-2px);
    }
    `;

    const ChartWrapper = styled.div`
    width: 100%;
    padding: 24px;
    background: linear-gradient(135deg, rgba(102,126,234,0.03), rgba(118,75,162,0.03));
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(102,126,234,0.1);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 8px 32px rgba(102,126,234,0.12);
        border-color: rgba(102,126,234,0.2);
    }

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(102,126,234,0.08), transparent);
        animation: ${float} 8s ease-in-out infinite;
    }
    `;

    const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    animation: ${fadeIn} 0.8s ease-out 0.2s backwards;
    `;

    const StatCard = styled.div`
    padding: 20px;
    background: linear-gradient(135deg, ${props => props.color}12 0%, ${props => props.color}05 100%);
    border-radius: 14px;
    border: 2px solid ${props => props.color}25;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
        background: ${props => props.color};
        transition: width 0.3s ease;
    }

    &::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, ${props => props.color}15, transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 12px 32px ${props => props.color}25;
        border-color: ${props => props.color}60;

        &::before {
        width: 100%;
        opacity: 0.08;
        }

        &::after {
        opacity: 1;
        }
    }

    &.selected {
        border-color: ${props => props.color};
        box-shadow: 0 8px 24px ${props => props.color}30;
        animation: ${pulse} 2s ease-in-out infinite;
    }
    `;

    const StatHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    `;

    const StatLabel = styled.div`
    font-size: 0.88rem;
    color: #555;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    `;

    const CategoryIcon = styled.span`
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${props => props.color};
    box-shadow: 0 2px 8px ${props => props.color}50;
    display: inline-block;
    `;

    const StatValue = styled.div`
    font-size: 1.5rem;
    font-weight: 900;
    color: ${props => props.color};
    background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}70 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 8px 0;
    position: relative;
    z-index: 1;
    `;

    const StatDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
    `;

    const StatPercentage = styled.div`
    font-size: 0.8rem;
    color: #777;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    `;

    const PercentageBar = styled.div`
    width: 50px;
    height: 4px;
    background: rgba(0,0,0,0.1);
    border-radius: 2px;
    overflow: hidden;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: ${props => props.percentage}%;
        background: ${props => props.color};
        border-radius: 2px;
        transition: width 0.6s ease;
    }
    `;

    const RecurringBadge = styled.span`
    font-size: 0.68rem;
    background: linear-gradient(135deg, #ff9800, #ff6b6b);
    color: #fff;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
    `;

    const TransactionCount = styled.span`
    font-size: 0.75rem;
    background: rgba(102, 126, 234, 0.12);
    color: #667eea;
    padding: 3px 8px;
    border-radius: 8px;
    font-weight: 600;
    `;

    const EmptyState = styled.div`
    text-align: center;
    padding: 80px 20px;
    color: #999;
    animation: ${fadeIn} 0.6s ease-out;

    .icon {
        font-size: 5rem;
        margin-bottom: 24px;
        opacity: 0.4;
        animation: ${float} 4s ease-in-out infinite;
    }

    h3 {
        font-size: 1.5rem;
        color: #555;
        margin-bottom: 12px;
        font-weight: 700;
    }

    p {
        font-size: 1rem;
        color: #888;
        line-height: 1.6;
    }
    `;

    const TotalCard = styled.div`
    padding: 28px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 20px;
    color: white;
    text-align: center;
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.35);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
        );
        animation: ${shimmer} 3s infinite;
    }
    `;

    const TotalLabel = styled.div`
    font-size: 1rem;
    opacity: 0.95;
    font-weight: 600;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    z-index: 1;
    `;

    const TotalAmount = styled.div`
    font-size: 2.8rem;
    font-weight: 900;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    position: relative;
    z-index: 1;
    letter-spacing: -1px;
    `;

    const TotalSubtext = styled.div`
    font-size: 0.85rem;
    opacity: 0.85;
    margin-top: 8px;
    font-weight: 500;
    position: relative;
    z-index: 1;
    `;

    // Enhanced Tooltip
    const CustomTooltip = styled.div`
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(15px);
    padding: 18px;
    border-radius: 14px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    border: 2px solid ${props => props.color}40;
    min-width: 180px;

    .label { 
        font-weight: 800; 
        color: #333; 
        margin-bottom: 10px;
        font-size: 1.05rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .amount { 
        font-size: 1.5rem; 
        font-weight: 900; 
        color: ${props => props.color};
        margin: 8px 0;
    }
    .percentage { 
        font-size: 0.88rem; 
        color: #666; 
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .count {
        font-size: 0.82rem;
        color: #888;
        margin-top: 6px;
        font-weight: 500;
    }
    `;

    const ColorDot = styled.span`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.color};
    display: inline-block;
    box-shadow: 0 2px 6px ${props => props.color}60;
    `;

    const InsightsCard = styled.div`
    padding: 20px;
    background: linear-gradient(135deg, rgba(67, 233, 123, 0.08), rgba(56, 249, 215, 0.08));
    border-radius: 16px;
    border: 1px solid rgba(67, 233, 123, 0.2);
    animation: ${fadeIn} 1s ease-out 0.4s backwards;
    `;

    const InsightTitle = styled.h4`
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    `;

    const InsightText = styled.p`
    font-size: 0.92rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 8px;

    strong {
        color: #43e97b;
        font-weight: 700;
    }
    `;

    // Main Component
    export default function ExpenseChart({ data }) {
    const [viewMode, setViewMode] = useState('pie');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Aggregate categories with transaction count
    const chartData = useMemo(() => {
        const aggregated = data.reduce((acc, curr) => {
        const exist = acc.find(a => a.category === curr.category);
        if (exist) {
            exist.amount += curr.amount;
            exist.count += 1;
        } else {
            acc.push({ 
            category: curr.category, 
            amount: curr.amount, 
            recurring: curr.recurring || false,
            count: 1
            });
        }
        return acc;
        }, []);
        
        return aggregated.sort((a, b) => b.amount - a.amount);
    }, [data]);

    const total = useMemo(() => 
        chartData.reduce((sum, item) => sum + item.amount, 0),
        [chartData]
    );

    const insights = useMemo(() => {
        if (chartData.length === 0) return null;
        
        const highest = chartData[0];
        const highestPercent = ((highest.amount / total) * 100).toFixed(1);
        const avgExpense = (total / chartData.length).toFixed(2);
        const recurringCount = chartData.filter(item => item.recurring).length;
        
        return { highest, highestPercent, avgExpense, recurringCount };
    }, [chartData, total]);

    // Enhanced Tooltip
    const renderCustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
        const data = payload[0];
        const percentage = ((data.value / total) * 100).toFixed(1);
        const item = chartData.find(d => d.category === data.name);
        
        return (
            <CustomTooltip color={data.payload.fill}>
            <div className="label">
                <ColorDot color={data.payload.fill} />
                {data.name}
            </div>
            <div className="amount">₹{data.value.toLocaleString()}</div>
            <div className="percentage">
                📊 {percentage}% of total spending
            </div>
            {item && (
                <div className="count">
                🔢 {item.count} transaction{item.count !== 1 ? 's' : ''}
                </div>
            )}
            </CustomTooltip>
        );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
        <EmptyState>
            <div className="icon">📊</div>
            <h3>No Expense Data Available</h3>
            <p>Start adding expenses to see your spending breakdown<br/>and visualize your financial patterns</p>
        </EmptyState>
        );
    }

    return (
        <ChartContainer>
        <TotalCard>
            <TotalLabel>💰 Total Expenses</TotalLabel>
            <TotalAmount>₹{total.toLocaleString()}</TotalAmount>
            <TotalSubtext>
            {chartData.length} categor{chartData.length !== 1 ? 'ies' : 'y'} • {data.length} transaction{data.length !== 1 ? 's' : ''}
            </TotalSubtext>
        </TotalCard>

        <ViewToggle>
            <ToggleButton active={viewMode === 'pie'} onClick={() => setViewMode('pie')}>
            🥧 Pie Chart
            </ToggleButton>
            <ToggleButton active={viewMode === 'bar'} onClick={() => setViewMode('bar')}>
            📊 Bar Chart
            </ToggleButton>
            <ToggleButton active={viewMode === 'area'} onClick={() => setViewMode('area')}>
            📈 Area Chart
            </ToggleButton>
        </ViewToggle>

        <ChartWrapper>
            <ResponsiveContainer width="100%" height={420}>
            {viewMode === 'pie' ? (
                <PieChart>
                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={70}
                    paddingAngle={3}
                    label={entry => {
                    const percent = ((entry.value / total) * 100).toFixed(1);
                    return percent > 5 ? `${percent}%` : '';
                    }}
                    labelLine={false}
                >
                    {chartData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="white" 
                        strokeWidth={3}
                        style={{
                        filter: selectedCategory && selectedCategory !== entry.category 
                            ? 'brightness(0.5)' 
                            : 'brightness(1)',
                        transition: 'all 0.3s ease'
                        }}
                    />
                    ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend 
                    verticalAlign="bottom" 
                    height={50} 
                    iconType="circle" 
                    wrapperStyle={{ 
                    paddingTop: '24px', 
                    fontSize: '0.92rem', 
                    fontWeight: '700' 
                    }} 
                />
                </PieChart>
            ) : viewMode === 'bar' ? (
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12, fontWeight: 600 }}
                    stroke="#888"
                />
                <YAxis 
                    tick={{ fontSize: 12, fontWeight: 600 }}
                    stroke="#888"
                />
                <Tooltip content={renderCustomTooltip} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                    />
                    ))}
                </Bar>
                </BarChart>
            ) : (
                <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12, fontWeight: 600 }}
                    stroke="#888"
                />
                <YAxis 
                    tick={{ fontSize: 12, fontWeight: 600 }}
                    stroke="#888"
                />
                <Tooltip content={renderCustomTooltip} />
                <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                />
                </AreaChart>
            )}
            </ResponsiveContainer>
        </ChartWrapper>

        {insights && (
            <InsightsCard>
            <InsightTitle>💡 Spending Insights</InsightTitle>
            <InsightText>
                Your highest spending category is <strong>{insights.highest.category}</strong> at ₹{insights.highest.amount.toLocaleString()} ({insights.highestPercent}% of total).
            </InsightText>
            <InsightText>
                Average spending per category is <strong>₹{insights.avgExpense}</strong>.
            </InsightText>
            {insights.recurringCount > 0 && (
                <InsightText>
                You have <strong>{insights.recurringCount}</strong> recurring expense categor{insights.recurringCount !== 1 ? 'ies' : 'y'}.
                </InsightText>
            )}
            </InsightsCard>
        )}

        <StatsContainer>
            {chartData.map((item, index) => {
            const percentage = ((item.amount / total) * 100).toFixed(1);
            const color = COLORS[index % COLORS.length];

            return (
                <StatCard 
                key={item.category} 
                color={color}
                className={selectedCategory === item.category ? 'selected' : ''}
                onClick={() => setSelectedCategory(
                    selectedCategory === item.category ? null : item.category
                )}
                >
                <StatHeader>
                    <StatLabel>
                    <CategoryIcon color={color} />
                    {item.category}
                    </StatLabel>
                    <TransactionCount>{item.count}×</TransactionCount>
                </StatHeader>
                
                <StatValue color={color}>
                    ₹{item.amount.toLocaleString()}
                </StatValue>
                
                <StatDetails>
                    <StatPercentage>
                    {percentage}%
                    <PercentageBar percentage={percentage} color={color} />
                    </StatPercentage>
                    {item.recurring && <RecurringBadge>Auto</RecurringBadge>}
                </StatDetails>
                </StatCard>
            );
            })}
        </StatsContainer>
        </ChartContainer>
    );
    }