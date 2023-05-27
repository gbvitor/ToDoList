const tBody = document.querySelector('tbody'); // Seleciona o elemento <tbody> do DOM
const addForm = document.querySelector('.add-form'); // Seleciona o elemento com a classe 'add-form'
const inputTask = document.querySelector('.input-task'); // Seleciona o elemento com a classe 'input-task'

const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tasks'); // Faz uma requisição GET para 'http://localhost:3333/tasks'
  const tasks = await response.json(); // Converte a resposta em formato JSON
  return tasks; // Retorna as tarefas obtidas
};

const addTask = async (event) => {
  event.preventDefault(); // Impede o comportamento padrão do formulário de recarregar a página
  const task = { title: inputTask.value }; // Cria um objeto de tarefa com o valor do campo de entrada
  await fetch('http://localhost:3333/tasks', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(task), // Envia os dados da tarefa como JSON no corpo da requisição POST
  });
  loadTasks(); // Recarrega a lista de tarefas
  inputTask.value = ''; // Limpa o campo de entrada
};

const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'delete', // Envia uma requisição DELETE para o servidor para excluir a tarefa com o ID fornecido
  });
  loadTasks(); // Recarrega a lista de tarefas
};

const updateTask = async ({ id, title, status }) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'put', // Envia uma requisição PUT para atualizar a tarefa com o ID fornecido
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title, status }), // Envia os dados atualizados da tarefa como JSON no corpo da requisição PUT
  });
  loadTasks(); // Recarrega a lista de tarefas
};

const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' };
  const date = new Date(dateUTC).toLocaleString('pt-br', options); // Formata a data e hora no formato desejado (data longa, hora curta) para o idioma pt-br
  return date; // Retorna a data formatada
};

const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag); // Cria um novo elemento HTML com a tag fornecida
  if (innerText) {
    element.innerText = innerText; // Define o texto interno do elemento, se fornecido
  }
  if (innerHTML) {
    element.innerHTML = innerHTML; // Define o HTML interno do elemento, se fornecido
  }
  return element; // Retorna o elemento criado
};

const createSelect = (value) => {
  const options = `<option value="pendente">pendente</option>
  <option value="em andamento">em andamento</option>
  <option value="concluída">concluída</option>`;
  const select = createElement('select', '', options); // Cria um elemento <select> com as opções de status
  select.value = value; // Define o valor selecionado do elemento <select> com base no valor fornecido
  return select; // Retorna o elemento <select> criado
};

const createRow = (task) => {
  const { id, title, created_at, status } = task; // Extrai as propriedades do objeto task
  const tr = createElement('tr'); // Cria um elemento <tr> (linha da tabela)
  const tdTitle = createElement('td', title); // Cria um elemento <td> (célula da tabela) com o título da tarefa
  const tdCreatedAt = createElement('td', formatDate(created_at)); // Cria um elemento <td> com a data de criação formatada
  const tdStatus = createElement('td'); // Cria um elemento <td> para o status da tarefa
  const tdActions = createElement('td'); // Cria um elemento <td> para as ações (editar e excluir) da tarefa

  const select = createSelect(status); // Cria um elemento <select> com as opções de status e define o valor selecionado

  select.addEventListener(
    'change',
    ({ target }) => updateTask({ ...task, status: target.value }) // Adiciona um ouvinte de evento de alteração para atualizar o status da tarefa
  );

  const editButton = createElement(
    'button',
    '',
    '<span class="material-symbols-outlined">edit</span>'
  ); // Cria um botão de edição com um ícone 'edit'

  const deleteButton = createElement(
    'button',
    '',
    '<span class="material-symbols-outlined">delete</span>'
  ); // Cria um botão de exclusão com um ícone 'delete'

  const editForm = createElement('form'); // Cria um formulário para a edição do título da tarefa
  const editInput = createElement('input'); // Cria um campo de entrada para a edição do título

  editInput.value = title; // Define o valor do campo de entrada como o título atual da tarefa
  editForm.appendChild(editInput); // Adiciona o campo de entrada ao formulário

  editForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário de recarregar a página
    updateTask({ id, title: editInput.value, status }); // Atualiza a tarefa com o novo título fornecido
  });

  editButton.addEventListener('click', () => {
    tdTitle.innerText = ''; // Remove o texto interno da célula do título
    tdTitle.appendChild(editForm); // Adiciona o formulário de edição ao lugar do texto interno da célula do título
  });

  editButton.classList.add('btn-action'); // Adiciona uma classe 'btn-action' ao botão de edição
  deleteButton.classList.add('btn-action'); // Adiciona uma classe 'btn-action' ao botão de exclusão

  deleteButton.addEventListener('click', () => deleteTask(id)); // Adiciona um ouvinte de evento de clique para excluir a tarefa com o ID correspondente

  tdStatus.appendChild(select); // Adiciona o elemento <select> à célula do status da tabela

  tdActions.appendChild(editButton); // Adiciona o botão de edição à célula das ações da tabela
  tdActions.appendChild(deleteButton); // Adiciona o botão de exclusão à célula das ações da tabela

  tr.appendChild(tdTitle); // Adiciona a célula do título à linha da tabela
  tr.appendChild(tdCreatedAt); // Adiciona a célula da data de criação à linha da tabela
  tr.appendChild(tdStatus); // Adiciona a célula do status à linha da tabela
  tr.appendChild(tdActions); // Adiciona a célula das ações à linha da tabela

  return tr; // Retorna a linha da tabela criada
};

const loadTasks = async () => {
  const tasks = await fetchTasks(); // Carrega as tarefas do servidor
  tBody.innerHTML = ''; // Limpa o conteúdo atual do corpo da tabela
  tasks.forEach((task) => {
    const tr = createRow(task); // Cria uma linha da tabela para cada tarefa
    tBody.appendChild(tr); // Adiciona a linha à tabela
  });
};

addForm.addEventListener('submit', addTask); // Adiciona um ouvinte de evento de envio para adicionar uma nova tarefa quando o formulário é enviado

loadTasks(); // Carrega as tarefas ao carregar a página
