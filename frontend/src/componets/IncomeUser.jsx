const IncomeUser = (props) => {
  console.log("Income User Card", props);
  return (
    <div class="card">
      <div class="card-header">Job Breakdown</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Cras justo odio</li>
        <li class="list-group-item">Dapibus ac facilisis in</li>
        <li class="list-group-item">Vestibulum at eros</li>
      </ul>
    </div>
  );
};

export default IncomeUser;
