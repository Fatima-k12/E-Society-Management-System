const DashboardCard = ({ title, icon, onClick }) => {
    return (
        <div className="col-md-4" onClick={onClick} style={{ cursor: "pointer" }}>
            <div className="card text-center p-3">
                <i className={`bi ${icon} display-4`}></i>
                <h5 className="mt-2">{title}</h5>
            </div>
        </div>
    );
};

export default DashboardCard; // ✅ Ensure this line is present
