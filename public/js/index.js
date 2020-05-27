(function () {
  let tarefas = JSON.parse(sessionStorage.getItem('tarefas')) || [];

  const create = (texto, prioridade = 1) => ({
    id: (tarefas[tarefas.length - 1]?.id || 0) + 1,
    texto,
    prioridade,
    feito: false,
  });

  const prioridades = {
    1: 'Baixa',
    2: 'Media',
    3: 'Alta',
  };

  const destroy = (id) =>
    (tarefas = tarefas.filter((tarefa) => tarefa.id != id));

  const getTdInfo = (e) => {
    const td = e.target.parentElement.parentElement;
    const id = td.getAttribute('data-tarefa-id');
    const tarefa = tarefas.find((tarefa) => tarefa.id == id);
    return { id, tarefa };
  };

  const deleteOnClick = (e) => {
    const { id, tarefa } = getTdInfo(e);
    if (
      !window.confirm(
        `Tem certeza que deseja excluir a tarefa: '${tarefa.texto}'?`
      )
    )
      return;
    render(destroy(id));
  };

  const toggle = (id) => {
    return (tarefas = tarefas.map((tarefa) => {
      if (tarefa.id == id) {
        tarefa = { ...tarefa, feito: !tarefa.feito };
      }
      return tarefa;
    }));
  };

  const checkOnClick = (e) => {
    const { id } = getTdInfo(e);
    render(toggle(id));
  };

  const render = (tarefas) => {
    let tbody = document.querySelector('#table').firstElementChild;
    tbody.innerHTML = '';
    for (tarefa of tarefas) {
      const { id, texto, prioridade, feito } = tarefa;
      const row = document.createElement('tr');
      row.setAttribute('data-tarefa-id', id);
      const tdCheck = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      if (feito) {
        checkbox.setAttribute('checked', '');
        row.classList.add('done');
      }
      tdCheck.appendChild(checkbox);
      const tdTexto = document.createElement('td');
      tdTexto.innerText = texto;
      const tdAcoes = document.createElement('td');
      const icon = document.createElement('i');
      icon.innerText = 'delete';
      icon.classList.add('material-icons');
      tdAcoes.appendChild(icon);
      const tdPrioridade = document.createElement('td');
      tdPrioridade.innerText = prioridades[prioridade];
      row.appendChild(tdCheck);
      row.appendChild(tdTexto);
      row.appendChild(tdPrioridade);
      row.appendChild(tdAcoes);
      tdAcoes.addEventListener('click', deleteOnClick);
      tdCheck.addEventListener('click', checkOnClick);
      tbody.appendChild(row);
    }

    sessionStorage.setItem('tarefas', JSON.stringify(tarefas));
  };
  render(tarefas);

  document.querySelector('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.querySelector('#tf_2do').value;
    if (texto) {
      if (/^#\d/.test(texto)) {
        const tarefa = texto.replace(/^#\d{1,}/g, '').trim();
        let prioridade = texto.replace(/\D/g, '');
        prioridade = prioridade >= 3 ? 3 : prioridade;
        tarefas = [...tarefas, create(tarefa, Number(prioridade))];
      } else {
        tarefas = [...tarefas, create(texto)];
      }
      render(tarefas);
    }
    document.querySelector('#tf_2do').value = '';
  });
})();
