/**
 * Sistema de Viagens
 * Backend Google Apps Script — base inicial.
 * Inicialização não destrutiva: não apaga conteúdo existente.
 */

const APP = Object.freeze({
  name: 'Sistema de Viagens',
  version: '0.1.0-dev.8',
  sheets: {
    PAINEL: [],
    PESSOAS: ['PessoaID', 'Nome', 'Telefone', 'Observacoes', 'CriadoEm', 'AtualizadoEm', 'Status', 'TipoDocumento', 'NumeroDocumento', 'OrgaoEmissor'],
    VIAGENS: ['ViagemID', 'Nome', 'DataIda', 'DataRetorno', 'Destino', 'Status', 'Observacoes', 'CriadoEm', 'TipoEvento', 'DiasProgramados'],
    PROGRAMACAO: ['ProgramacaoID', 'ViagemID', 'Data', 'DiaAtivo', 'HoraIda', 'HoraVolta', 'Ordem', 'CriadoEm'],
    PARTICIPANTES: ['ParticipacaoID', 'ViagemID', 'PessoaID', 'Status', 'VeiculoID', 'NumeroAssento', 'ValorPrevisto', 'Observacoes', 'CriadoEm', 'AtualizadoEm'],
    PAGAMENTOS: ['PagamentoID', 'ParticipacaoID', 'Data', 'Valor', 'Forma', 'Referencia', 'Observacoes', 'RegistradoEm'],
    VEICULOS: ['VeiculoID', 'ViagemID', 'Tipo', 'Identificacao', 'Capacidade', 'Status', 'Observacoes', 'CriadoEm'],
    ASSENTOS: ['AssentoID', 'ViagemID', 'VeiculoID', 'NumeroAssento', 'Status', 'ParticipacaoID', 'AtualizadoEm'],
    CONFIG: ['Chave', 'Valor', 'Descricao']
  }
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sistema de Viagens')
    .addItem('Abrir painel', 'showMainPanel')
    .addSeparator()
    .addItem('Preparar estrutura (não apaga dados)', 'setupSistemaViagens')
    .addToUi();
}

function setupSistemaViagens() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Esta função precisa ser executada pelo Apps Script vinculado à planilha Sistema de Viagens.');
  }

  const estruturas = APP.sheets;
  const criadas = [];
  const verificadas = [];

  Object.keys(estruturas).forEach(function(nome) {
    let aba = ss.getSheetByName(nome);

    if (!aba) {
      aba = ss.insertSheet(nome);
      criadas.push(nome);
    }

    const cabecalhos = estruturas[nome];

    if (cabecalhos.length === 0) {
      verificadas.push(nome);
      return;
    }

    if (aba.getLastRow() === 0) {
      aba.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, cabecalhos.length)
        .setFontWeight('bold')
        .setBackground('#17365D')
        .setFontColor('#FFFFFF');
      aba.autoResizeColumns(1, cabecalhos.length);
      verificadas.push(nome);
      return;
    }

    const ultimaColuna = Math.max(aba.getLastColumn(), 1);
    const atual = aba.getRange(1, 1, 1, Math.max(ultimaColuna, cabecalhos.length)).getDisplayValues()[0];
    const colunasExistentes = Math.min(ultimaColuna, cabecalhos.length);
    const compativel = cabecalhos.slice(0, colunasExistentes).every(function(titulo, indice) {
      return atual[indice] === titulo;
    });

    if (!compativel) {
      throw new Error(
        'A aba "' + nome + '" já contém dados ou cabeçalhos diferentes. ' +
        'Por segurança, a inicialização foi interrompida sem apagar ou substituir conteúdo.'
      );
    }

    if (ultimaColuna < cabecalhos.length) {
      const novasColunas = cabecalhos.slice(ultimaColuna);
      aba.getRange(1, ultimaColuna + 1, 1, novasColunas.length).setValues([novasColunas]);
      aba.getRange(1, ultimaColuna + 1, 1, novasColunas.length)
        .setFontWeight('bold').setBackground('#17365D').setFontColor('#FFFFFF');
      aba.autoResizeColumns(ultimaColuna + 1, novasColunas.length);
    }

    verificadas.push(nome);
  });

  const painel = ss.getSheetByName('PAINEL');
  if (painel && painel.getLastRow() === 0) {
    painel.getRange('A1').setValue(APP.name);
    painel.getRange('A2').setValue('Estrutura inicial pronta. Cadastros vazios.');
    painel.getRange('A1').setFontSize(16).setFontWeight('bold');
  }

  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    'Sistema de Viagens',
    'Preparação concluída.\n\nAbas criadas: ' +
      (criadas.length ? criadas.join(', ') : 'nenhuma (já existiam)') +
      '\nAbas verificadas: ' + verificadas.join(', ') +
      '\n\nNenhum cadastro foi inserido e nenhum dado foi apagado.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}


function showMainPanel() {
  const html = HtmlService.createHtmlOutputFromFile('Main')
    .setTitle('Sistema de Viagens')
    .setWidth(1400)
    .setHeight(900);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sistema de Viagens');
}

function getAppSummary() {
  const ss = SpreadsheetApp.getActive();
  const count = name => {
    const sh = ss.getSheetByName(name);
    return sh && sh.getLastRow() > 1 ? sh.getLastRow() - 1 : 0;
  };
  return {
    version: APP.version,
    people: count('PESSOAS'),
    trips: count('VIAGENS'),
    participants: count('PARTICIPANTES'),
    payments: count('PAGAMENTOS'),
    vehicles: count('VEICULOS')
  };
}

function addPerson(data) {
  validateRequired_(data, ['nome']);
  return withLock_(() => {
    const sh = sheet_('PESSOAS');
    const name = clean_(data.nome);
    const phone = clean_(data.telefone || '');
    const duplicate = phone !== '' && rows_('PESSOAS').some(r =>
      norm_(r.Nome) === norm_(name) && norm_(r.Telefone) === norm_(phone) && r.Status !== 'INATIVO'
    );
    if (duplicate) throw new Error('Já existe cadastro ativo com este nome e telefone.');
    if (data.viagemId && !rows_('VIAGENS').some(r => r.ViagemID === data.viagemId && r.Status !== 'CANCELADA')) {
      throw new Error('A viagem selecionada não está disponível. Nenhum cadastro foi gravado.');
    }
    const id = newId_('P');
    sh.appendRow([id, name, phone, clean_(data.observacoes || ''), new Date(), new Date(), 'ATIVO', clean_(data.tipoDocumento || ''), clean_(data.numeroDocumento || ''), clean_(data.orgaoEmissor || '')]);
    let participacaoId = '';
    if (data.viagemId) {
      participacaoId = newId_('PV');
      sheet_('PARTICIPANTES').appendRow([participacaoId, data.viagemId, id, 'PENDENTE', '', '', 0, '', new Date(), new Date()]);
    }
    return { id: id, participacaoId: participacaoId };
  });
}

function updatePerson(data) {
  validateRequired_(data, ['pessoaId', 'nome']);
  return withLock_(() => {
    const sh = sheet_('PESSOAS');
    const row = findRowById_(sh, 'PessoaID', data.pessoaId);
    if (!row) throw new Error('Pessoa não encontrada.');
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0];
    const set = (header, value) => {
      const col = headers.indexOf(header) + 1;
      if (col > 0) sh.getRange(row, col).setValue(value);
    };
    set('Nome', clean_(data.nome));
    set('Telefone', clean_(data.telefone || ''));
    set('Observacoes', clean_(data.observacoes || ''));
    set('TipoDocumento', clean_(data.tipoDocumento || ''));
    set('NumeroDocumento', clean_(data.numeroDocumento || ''));
    set('OrgaoEmissor', clean_(data.orgaoEmissor || ''));
    set('AtualizadoEm', new Date());
    return { id: data.pessoaId, atualizado: true };
  });
}

function addTrip(data) {
  validateRequired_(data, ['nome', 'tipoEvento']);
  const schedule = Array.isArray(data.programacao) ? data.programacao : [];
  if (!schedule.length) throw new Error('Inclua pelo menos um dia na programação.');
  const activeDays = schedule.filter(d => d.ativo);
  if (!activeDays.length) throw new Error('Selecione pelo menos um dia com transporte.');
  activeDays.forEach((d, i) => {
    validateRequired_(d, ['data', 'horaIda', 'horaVolta']);
    if (d.horaVolta <= d.horaIda) throw new Error('A volta deve ocorrer depois da ida em ' + d.data + '.');
    if (i && d.data <= activeDays[i - 1].data) throw new Error('As datas da programação devem estar em ordem crescente e sem repetição.');
  });
  return withLock_(() => {
    // Verifica as duas abas antes de gravar para evitar viagem parcial.
    const tripsSheet = sheet_('VIAGENS');
    const scheduleSheet = sheet_('PROGRAMACAO');
    const firstDate = activeDays[0].data;
    const lastDate = activeDays[activeDays.length - 1].data;
    const tripName = clean_(data.nome);
    const tripDestination = clean_(data.destino || '');
    const tripType = clean_(data.tipoEvento);
    const duplicate = rows_('VIAGENS').find(r =>
      r.Status !== 'CANCELADA' &&
      norm_(r.Nome) === norm_(tripName) &&
      dateKey_(r.DataIda) === dateKey_(firstDate) &&
      dateKey_(r.DataRetorno) === dateKey_(lastDate) &&
      norm_(r.Destino) === norm_(tripDestination) &&
      norm_(r.TipoEvento) === norm_(tripType)
    );
    if (duplicate) {
      throw new Error('Esta viagem já está cadastrada (código ' + duplicate.ViagemID + '). Nenhum novo registro foi criado.');
    }
    const id = newId_('V');
    tripsSheet.appendRow([
      id, tripName, firstDate, lastDate,
      tripDestination, 'PLANEJADA', clean_(data.observacoes || ''), new Date(),
      tripType, activeDays.length
    ]);
    const sh = scheduleSheet;
    const rows = schedule.map((d, i) => [
      newId_('PR'), id, d.data, d.ativo ? 'SIM' : 'NAO',
      d.ativo ? d.horaIda : '', d.ativo ? d.horaVolta : '', i + 1, new Date()
    ]);
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    return { id: id, diasProgramados: activeDays.length };
  });
}

function listTripSchedule(viagemId) {
  validateRequired_({viagemId: viagemId}, ['viagemId']);
  return rows_('PROGRAMACAO').filter(r => r.ViagemID === viagemId)
    .sort((a, b) => String(a.Data).localeCompare(String(b.Data)))
    .map(r => ({ data: r.Data, ativo: r.DiaAtivo === 'SIM', horaIda: r.HoraIda || '', horaVolta: r.HoraVolta || '' }));
}

function enrollParticipant(data) {
  validateRequired_(data, ['viagemId', 'pessoaId']);
  return withLock_(() => {
    const people = rows_('PESSOAS');
    const person = people.find(r => r.PessoaID === data.pessoaId && r.Status === 'ATIVO');
    if (!person) throw new Error('Pessoa não encontrada ou inativa.');
    if (!rows_('VIAGENS').some(r => r.ViagemID === data.viagemId && r.Status !== 'CANCELADA')) {
      throw new Error('Viagem não encontrada ou cancelada.');
    }
    const exists = rows_('PARTICIPANTES').some(r =>
      r.ViagemID === data.viagemId && r.PessoaID === data.pessoaId && r.Status !== 'CANCELADO'
    );
    if (exists) throw new Error('Esta pessoa já está inscrita nesta viagem.');
    const id = newId_('PV');
    sheet_('PARTICIPANTES').appendRow([
      id, data.viagemId, data.pessoaId, 'PENDENTE', '', '',
      Number(data.valorPrevisto || 0), clean_(data.observacoes || ''), new Date(), new Date()
    ]);
    return { id: id, nome: person.Nome };
  });
}

function registerPayment(data) {
  validateRequired_(data, ['participacaoId', 'data', 'valor']);
  const amount = Number(data.valor);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Informe um valor de pagamento maior que zero.');
  return withLock_(() => {
    const participation = rows_('PARTICIPANTES').find(r =>
      r.ParticipacaoID === data.participacaoId && r.Status !== 'CANCELADO'
    );
    if (!participation) throw new Error('Participação não encontrada ou cancelada.');
    const id = newId_('PG');
    sheet_('PAGAMENTOS').appendRow([
      id, data.participacaoId, data.data, amount, clean_(data.forma || ''),
      clean_(data.referencia || ''), clean_(data.observacoes || ''), new Date()
    ]);
    return { id: id, totalPago: getPaymentTotals_(data.participacaoId).pago };
  });
}

function createVehicle(data) {
  validateRequired_(data, ['viagemId', 'tipo', 'identificacao', 'capacidade']);
  const capacity = Number(data.capacidade);
  if (!Number.isInteger(capacity) || capacity < 1) throw new Error('Capacidade deve ser um número inteiro positivo.');
  return withLock_(() => {
    if (!rows_('VIAGENS').some(r => r.ViagemID === data.viagemId && r.Status !== 'CANCELADA')) {
      throw new Error('Viagem não encontrada ou cancelada.');
    }
    const id = newId_('VC');
    sheet_('VEICULOS').appendRow([
      id, data.viagemId, clean_(data.tipo), clean_(data.identificacao),
      capacity, 'ATIVO', clean_(data.observacoes || ''), new Date()
    ]);
    const seats = [];
    for (let i = 1; i <= capacity; i++) {
      seats.push([newId_('AS'), data.viagemId, id, i, 'LIVRE', '', new Date()]);
    }
    const sh = sheet_('ASSENTOS');
    sh.getRange(sh.getLastRow() + 1, 1, seats.length, seats[0].length).setValues(seats);
    return { id: id, assentos: capacity };
  });
}

function assignSeat(data) {
  validateRequired_(data, ['participacaoId', 'veiculoId', 'numeroAssento']);
  return withLock_(() => {
    const p = rows_('PARTICIPANTES').find(r => r.ParticipacaoID === data.participacaoId && r.Status !== 'CANCELADO');
    if (!p) throw new Error('Participação não encontrada.');
    const v = rows_('VEICULOS').find(r => r.VeiculoID === data.veiculoId && r.Status === 'ATIVO');
    if (!v || v.ViagemID !== p.ViagemID) throw new Error('Veículo não pertence à mesma viagem.');
    const seatNo = Number(data.numeroAssento);
    const allSeats = rows_('ASSENTOS');
    const seat = allSeats.find(r =>
      r.ViagemID === p.ViagemID && r.VeiculoID === v.VeiculoID && Number(r.NumeroAssento) === seatNo
    );
    if (!seat) throw new Error('Assento não existe neste veículo.');
    if (seat.Status === 'OCUPADO' && seat.ParticipacaoID !== p.ParticipacaoID) throw new Error('Assento já ocupado.');
    const sh = sheet_('ASSENTOS');
    // Se a participação já tinha lugar, libera o anterior antes de mover.
    allSeats.filter(s => s.ParticipacaoID === p.ParticipacaoID && s.AssentoID !== seat.AssentoID).forEach(previous => {
      const previousRow = findRowById_(sh, 'AssentoID', previous.AssentoID);
      sh.getRange(previousRow, 5, 1, 3).setValues([['LIVRE', '', new Date()]]);
    });
    const row = findRowById_(sh, 'AssentoID', seat.AssentoID);
    sh.getRange(row, 5, 1, 3).setValues([['OCUPADO', p.ParticipacaoID, new Date()]]);
    const psh = sheet_('PARTICIPANTES');
    const prow = findRowById_(psh, 'ParticipacaoID', p.ParticipacaoID);
    psh.getRange(prow, 5, 1, 2).setValues([[v.VeiculoID, seatNo]]);
    psh.getRange(prow, 10).setValue(new Date());
    return { ok: true };
  });
}

function cancelParticipation(participacaoId) {
  if (!participacaoId) throw new Error('Participação não informada.');
  return withLock_(() => {
    const sh = sheet_('PARTICIPANTES');
    const row = findRowById_(sh, 'ParticipacaoID', participacaoId);
    if (!row) throw new Error('Participação não encontrada.');
    sh.getRange(row, 4).setValue('CANCELADO');
    sh.getRange(row, 10).setValue(new Date());
    const seats = rows_('ASSENTOS').filter(r => r.ParticipacaoID === participacaoId);
    const seatSheet = sheet_('ASSENTOS');
    seats.forEach(s => {
      const sr = findRowById_(seatSheet, 'AssentoID', s.AssentoID);
      seatSheet.getRange(sr, 5, 1, 3).setValues([['LIVRE', '', new Date()]]);
    });
    return { ok: true, historicoPreservado: true };
  });
}

function getPaymentTotals_(participacaoId) {
  const paid = rows_('PAGAMENTOS')
    .filter(r => r.ParticipacaoID === participacaoId)
    .reduce((sum, r) => sum + Number(r.Valor || 0), 0);
  const p = rows_('PARTICIPANTES').find(r => r.ParticipacaoID === participacaoId);
  const expected = p ? Number(p.ValorPrevisto || 0) : 0;
  return { pago: paid, previsto: expected, saldo: Math.max(0, expected - paid) };
}

function sheet_(name) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error('Aba ' + name + ' não encontrada. Execute a preparação da estrutura.');
  return sh;
}

function rows_(name) {
  const sh = sheet_(name);
  if (sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  return values.filter(row => row.some(v => v !== '')).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i] instanceof Date ? row[i] : String(row[i] == null ? '' : row[i]));
    return obj;
  });
}

function findRowById_(sh, header, id) {
  const values = sh.getDataRange().getValues();
  const col = values[0].indexOf(header);
  if (col < 0) throw new Error('Coluna ' + header + ' não encontrada.');
  for (let i = 1; i < values.length; i++) if (String(values[i][col]) === String(id)) return i + 1;
  return 0;
}

function newId_(prefix) {
  return prefix + '-' + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function validateRequired_(data, keys) {
  if (!data) throw new Error('Dados não informados.');
  keys.forEach(k => {
    if (data[k] === undefined || data[k] === null || String(data[k]).trim() === '') {
      throw new Error('Campo obrigatório: ' + k);
    }
  });
}

function clean_(value) {
  return String(value == null ? '' : value).trim();
}

function norm_(value) {
  return clean_(value).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function withLock_(fn) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}


function listPeople() {
  return rows_('PESSOAS').filter(r => r.Status === 'ATIVO')
    .map(r => ({ id: r.PessoaID, nome: r.Nome, telefone: r.Telefone, observacoes: r.Observacoes || '', tipoDocumento: r.TipoDocumento || '', numeroDocumento: r.NumeroDocumento || '', orgaoEmissor: r.OrgaoEmissor || '' }));
}

function listTrips() {
  return rows_('VIAGENS').filter(r => r.Status !== 'CANCELADA' && r.ViagemID)
    .map(r => ({
      id: clean_(r.ViagemID),
      nome: clean_(r.Nome),
      dataIda: dateKey_(r.DataIda),
      dataRetorno: dateKey_(r.DataRetorno),
      destino: clean_(r.Destino),
      status: clean_(r.Status),
      tipoEvento: clean_(r.TipoEvento || ''),
      diasProgramados: Number(r.DiasProgramados || 0)
    }))
    .sort((a, b) => a.dataIda.localeCompare(b.dataIda) || a.nome.localeCompare(b.nome));
}

function dateKey_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const text = clean_(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  return text;
}

function listParticipants(viagemId) {
  return rows_('PARTICIPANTES').filter(r => r.ViagemID === viagemId && r.Status !== 'CANCELADO')
    .map(r => {
      const person = rows_('PESSOAS').find(p => p.PessoaID === r.PessoaID);
      const totals = getPaymentTotals_(r.ParticipacaoID);
      return {
        id: r.ParticipacaoID, pessoaId: r.PessoaID,
        nome: person ? person.Nome : '(cadastro não localizado)',
        status: r.Status, veiculoId: r.VeiculoID, assento: r.NumeroAssento,
        previsto: totals.previsto, pago: totals.pago, saldo: totals.saldo
      };
    });
}

function listVehicles(viagemId) {
  return rows_('VEICULOS').filter(r => r.ViagemID === viagemId && r.Status === 'ATIVO')
    .map(r => ({ id: r.VeiculoID, tipo: r.Tipo, identificacao: r.Identificacao, capacidade: Number(r.Capacidade) }));
}


function getSeatMap(viagemId) {
  if (!viagemId) return [];
  return rows_('ASSENTOS').filter(r => r.ViagemID === viagemId).map(s => {
    const vehicle = rows_('VEICULOS').find(v => v.VeiculoID === s.VeiculoID);
    const participant = s.ParticipacaoID
      ? rows_('PARTICIPANTES').find(p => p.ParticipacaoID === s.ParticipacaoID) : null;
    const person = participant
      ? rows_('PESSOAS').find(p => p.PessoaID === participant.PessoaID) : null;
    return {
      id: s.AssentoID, veiculoId: s.VeiculoID,
      veiculo: vehicle ? vehicle.Identificacao : '',
      numero: Number(s.NumeroAssento), status: s.Status,
      participacaoId: s.ParticipacaoID || '',
      passageiro: person ? person.Nome : ''
    };
  }).sort((a,b) => a.veiculo.localeCompare(b.veiculo) || a.numero-b.numero);
}

function getTripReport(viagemId) {
  if (!viagemId) throw new Error('Selecione uma viagem.');
  const trip = rows_('VIAGENS').find(r => r.ViagemID === viagemId);
  if (!trip) throw new Error('Viagem não encontrada.');
  const participants = listParticipants(viagemId);
  const vehicles = listVehicles(viagemId);
  const seats = getSeatMap(viagemId);
  return {
    trip: { nome: trip.Nome, dataIda: trip.DataIda, dataRetorno: trip.DataRetorno, destino: trip.Destino, status: trip.Status },
    participants: participants,
    vehicles: vehicles.map(v => ({
      ...v,
      ocupados: seats.filter(s => s.veiculoId === v.id && s.status === 'OCUPADO').length,
      livres: seats.filter(s => s.veiculoId === v.id && s.status === 'LIVRE').length
    })),
    totals: {
      inscritos: participants.length,
      previsto: participants.reduce((s,p) => s + Number(p.previsto || 0), 0),
      pago: participants.reduce((s,p) => s + Number(p.pago || 0), 0),
      saldo: participants.reduce((s,p) => s + Number(p.saldo || 0), 0)
    },
    seats: seats
  };
}

function getReportData(viagemId,tipo){
  if(!viagemId) throw new Error('Selecione uma viagem.');
  const trip=rows_('VIAGENS').find(r=>r.ViagemID===viagemId);
  if(!trip) throw new Error('Viagem não encontrada.');
  const people=rows_('PESSOAS'), parts=rows_('PARTICIPANTES').filter(r=>r.ViagemID===viagemId&&r.Status!=='CANCELADO');
  const vehicles=rows_('VEICULOS').filter(r=>r.ViagemID===viagemId), seats=rows_('ASSENTOS').filter(r=>r.ViagemID===viagemId), pays=rows_('PAGAMENTOS');
  const data=parts.map(p=>{
    const person=people.find(x=>x.PessoaID===p.PessoaID)||{}, vehicle=vehicles.find(x=>x.VeiculoID===p.VeiculoID)||{};
    const payments=pays.filter(x=>x.ParticipacaoID===p.ParticipacaoID), paid=payments.reduce((s,x)=>s+Number(x.Valor||0),0), expected=Number(p.ValorPrevisto||0);
    return {id:p.ParticipacaoID,nome:person.Nome||'(não localizado)',telefone:person.Telefone||'',status:p.Status,veiculo:vehicle.Identificacao||'',tipoVeiculo:vehicle.Tipo||'',assento:p.NumeroAssento||'',previsto:expected,pago:paid,saldo:Math.max(0,expected-paid),pagamentos:payments.map(x=>({data:reportDate_(x.Data),valor:Number(x.Valor||0),forma:x.Forma||'',referencia:x.Referencia||''}))};
  });
  const titles={geral:'Lista geral de participantes',veiculo:'Lista por veículo e assento',capitao:'Lista do capitão',pagamentos:'Lista de pagamentos',confirmados:'Lista de passageiros confirmados',resumo:'Resumo geral da viagem'};
  if(!titles[tipo]) throw new Error('Tipo de lista inválido.');
  let rows=data;
  if(tipo==='confirmados') rows=data.filter(p=>['CONFIRMADO','CONFIRMADA'].includes(String(p.status).toUpperCase()));
  if(tipo==='veiculo'||tipo==='capitao') rows=data.filter(p=>p.veiculo||p.assento);
  rows=rows.slice().sort((a,b)=>(tipo==='veiculo'||tipo==='capitao'?(a.veiculo.localeCompare(b.veiculo,'pt-BR')||Number(a.assento||0)-Number(b.assento||0)):a.nome.localeCompare(b.nome,'pt-BR')));
  const sum=k=>data.reduce((s,p)=>s+Number(p[k]||0),0);
  return {title:titles[tipo],trip:{nome:trip.Nome,destino:trip.Destino,dataIda:reportDate_(trip.DataIda),dataRetorno:reportDate_(trip.DataRetorno),status:trip.Status},
    rows:tipo==='pagamentos'?data:rows,
    paymentDetails:tipo==='pagamentos'?data.flatMap(p=>p.pagamentos.map(pg=>({nome:p.nome,...pg}))):[],
    vehicles:vehicles.map(v=>({nome:v.Identificacao,tipo:v.Tipo,capacidade:Number(v.Capacidade||0),ocupados:seats.filter(s=>s.VeiculoID===v.VeiculoID&&s.Status==='OCUPADO').length,livres:seats.filter(s=>s.VeiculoID===v.VeiculoID&&s.Status==='LIVRE').length})),
    totals:{participantes:data.length,confirmados:data.filter(p=>['CONFIRMADO','CONFIRMADA'].includes(String(p.status).toUpperCase())).length,previsto:sum('previsto'),pago:sum('pago'),saldo:sum('saldo'),veiculos:vehicles.length,capacidade:vehicles.reduce((s,v)=>s+Number(v.Capacidade||0),0),ocupados:seats.filter(s=>s.Status==='OCUPADO').length,livres:seats.filter(s=>s.Status==='LIVRE').length}};
}

function reportDate_(value){return value instanceof Date?Utilities.formatDate(value,Session.getScriptTimeZone(),'dd/MM/yyyy'):String(value||'');}


/** Importação em lote: recebe matriz com cabeçalho na primeira linha. */

function importAmount_(value) {
  if (typeof value === 'number') return value;
  let s = clean_(value).replace(/R\$/gi,'').replace(/\s/g,'');
  if (s.includes(',')) s = s.replace(/\./g,'').replace(',','.');
  return Number(s);
}
function importDateKey_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const s = clean_(value);
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return m[3]+'-'+m[2]+'-'+m[1];
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[1]+'-'+m[2]+'-'+m[3] : s;
}
function importDateValue_(value) {
  if (value instanceof Date) return value;
  const s = clean_(value);
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]));
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
  const d = new Date(s);
  if (isNaN(d.getTime())) throw new Error('Data inválida na importação: '+s);
  return d;
}

function previewBatchImport(tipo, viagemId, matriz) {
  if (!Array.isArray(matriz) || matriz.length < 2) throw new Error('Inclua o cabeçalho e pelo menos uma linha de dados.');
  if (!['pessoas','participantes','pagamentos'].includes(tipo)) throw new Error('Tipo de importação inválido.');
  if (tipo !== 'pessoas' && !viagemId) throw new Error('Selecione a viagem antes de importar estes registros.');
  const headers = matriz[0].map(h => norm_(h));
  const idx = names => headers.findIndex(h => names.includes(h));
  const col = {
    nome: idx(['nome','nome completo','passageiro','pessoa']),
    pessoaId: idx(['pessoaid','id pessoa','id']),
    telefone: idx(['telefone','celular','whatsapp']),
    tipoDocumento: idx(['tipodocumento','tipo documento','documento tipo']),
    numeroDocumento: idx(['numerodocumento','numero documento','documento']),
    orgaoEmissor: idx(['orgaoemissor','orgao emissor']),
    observacoes: idx(['observacoes','observação','observacoes']),
    valorPrevisto: idx(['valorprevisto','valor previsto','previsto']),
    data: idx(['data','data pagamento']),
    valor: idx(['valor','valor pago','pagamento']),
    forma: idx(['forma','forma pagamento','meio pagamento']),
    referencia: idx(['referencia','referência'])
  };
  if (tipo === 'pessoas' && col.nome < 0) throw new Error('A importação de pessoas precisa de uma coluna Nome.');
  if (tipo === 'participantes' && col.nome < 0 && col.pessoaId < 0) throw new Error('Use uma coluna Nome ou PessoaID para identificar os participantes.');
  if (tipo === 'pagamentos' && (col.nome < 0 && col.pessoaId < 0 || col.data < 0 || col.valor < 0)) throw new Error('Pagamentos precisam de Pessoa/Nome ou PessoaID, Data e Valor.');
  const people = rows_('PESSOAS');
  const parts = rows_('PARTICIPANTES');
  const trips = rows_('VIAGENS');
  if (tipo !== 'pessoas' && !trips.some(t => t.ViagemID === viagemId && t.Status !== 'CANCELADA')) throw new Error('Viagem não encontrada ou cancelada.');
  const seen = new Set();
  const result = [];
  let duplicados = 0, invalidos = 0;
  matriz.slice(1).forEach((line, n) => {
    if (!line || !line.some(v => clean_(v) !== '')) return;
    const get = k => col[k] >= 0 ? clean_(line[col[k]]) : '';
    const row = { linha: n + 2, nome: get('nome'), pessoaId: get('pessoaId'), telefone: get('telefone'),
      tipoDocumento: get('tipoDocumento'), numeroDocumento: get('numeroDocumento'), orgaoEmissor: get('orgaoEmissor'),
      observacoes: get('observacoes'), valorPrevisto: get('valorPrevisto'), data: get('data'), valor: get('valor'),
      forma: get('forma'), referencia: get('referencia') };
    let status = 'PRONTO', motivo = '';
    if (tipo === 'pessoas') {
      if (!row.nome) { status='ERRO'; motivo='Nome não informado'; }
      else {
        const key = norm_(row.nome)+'|'+norm_(row.telefone);
        const sameName = people.filter(p => norm_(p.Nome)===norm_(row.nome) && p.Status!=='INATIVO');
        if (!row.telefone && (sameName.length || seen.has(key))) { status='ERRO'; motivo='Nome sem telefone para diferenciar; confira se é homônimo antes de importar'; }
        else if (seen.has(key) || (row.telefone && sameName.some(p => norm_(p.Telefone)===norm_(row.telefone)))) { status='DUPLICADO'; motivo='Pessoa já cadastrada ou repetida no arquivo'; }
        seen.add(key);
      }
    } else {
      const matches = people.filter(p => p.Status==='ATIVO' && ((row.pessoaId && p.PessoaID===row.pessoaId) || (row.nome && norm_(p.Nome)===norm_(row.nome) && (!row.telefone || norm_(p.Telefone)===norm_(row.telefone)))));
      const person = matches.length===1 ? matches[0] : null;
      if (!person) { status='ERRO'; motivo=matches.length>1?'Nome ambíguo: informe PessoaID ou telefone para identificar sem risco.':'Pessoa não encontrada no cadastro único'; }
      else {
        row.pessoaId = person.PessoaID; row.nome = person.Nome;
        const part = parts.find(p => p.ViagemID===viagemId && p.PessoaID===person.PessoaID && p.Status!=='CANCELADO');
        if (tipo==='participantes' && (part || seen.has(person.PessoaID))) { status='DUPLICADO'; motivo='Pessoa já vinculada a esta viagem'; }
        if (tipo==='pagamentos' && !part) { status='ERRO'; motivo='Pessoa ainda não está vinculada a esta viagem'; }
        if (tipo==='pagamentos' && (!row.data || !Number.isFinite(importAmount_(row.valor)) || importAmount_(row.valor)<=0)) { status='ERRO'; motivo='Data ou valor inválido'; }
        if (tipo==='participantes' && row.valorPrevisto && (!Number.isFinite(importAmount_(row.valorPrevisto)) || importAmount_(row.valorPrevisto)<0)) { status='ERRO'; motivo='Valor previsto inválido'; }
        if (tipo==='participantes') seen.add(person.PessoaID);
        if (tipo==='pagamentos' && part) {
          row.participacaoId=part.ParticipacaoID;
          const signature = [part.ParticipacaoID,importDateKey_(row.data),importAmount_(row.valor),norm_(row.forma),norm_(row.referencia)].join('|');
          const already = rows_('PAGAMENTOS').some(pg => [pg.ParticipacaoID,importDateKey_(pg.Data),importAmount_(pg.Valor),norm_(pg.Forma),norm_(pg.Referencia)].join('|')===signature);
          if (already || seen.has(signature)) { status='DUPLICADO'; motivo='Lançamento de pagamento já existente ou repetido no arquivo'; }
          seen.add(signature);
        }
      }
    }
    if (status==='DUPLICADO') duplicados++;
    if (status==='ERRO') invalidos++;
    result.push({linha:row.linha,nome:row.nome,status:status,motivo:motivo});
  });
  return {tipo:tipo,total:result.length,prontos:result.filter(x=>x.status==='PRONTO').length,duplicados:duplicados,invalidos:invalidos,linhas:result};
}

function applyBatchImport(tipo, viagemId, matriz) {
  return withLock_(() => {
    const preview = previewBatchImport(tipo, viagemId, matriz);
    const headers = matriz[0].map(h => norm_(h));
    const idx = names => headers.findIndex(h => names.includes(h));
    const col = {nome:idx(['nome','nome completo','passageiro','pessoa']),pessoaId:idx(['pessoaid','id pessoa','id']),
      telefone:idx(['telefone','celular','whatsapp']),tipoDocumento:idx(['tipodocumento','tipo documento','documento tipo']),
      numeroDocumento:idx(['numerodocumento','numero documento','documento']),orgaoEmissor:idx(['orgaoemissor','orgao emissor']),
      observacoes:idx(['observacoes','observação','observacoes']),valorPrevisto:idx(['valorprevisto','valor previsto','previsto']),
      data:idx(['data','data pagamento']),valor:idx(['valor','valor pago','pagamento']),forma:idx(['forma','forma pagamento','meio pagamento']),referencia:idx(['referencia','referência'])};
    const ready = new Set(preview.linhas.filter(x=>x.status==='PRONTO').map(x=>x.linha));
    let imported=0;
    matriz.slice(1).forEach((line,i)=>{
      const lineNo=i+2; if(!ready.has(lineNo)) return;
      const get=k=>col[k]>=0?clean_(line[col[k]]):'';
      if(tipo==='pessoas'){
        const name=get('nome'), phone=get('telefone'), id=newId_('P');
        sheet_('PESSOAS').appendRow([id,name,phone,get('observacoes'),new Date(),new Date(),'ATIVO',get('tipoDocumento'),get('numeroDocumento'),get('orgaoEmissor')]);
        if (viagemId) sheet_('PARTICIPANTES').appendRow([newId_('PV'),viagemId,id,'PENDENTE','','',0,'',new Date(),new Date()]);
      } else {
        const people=rows_('PESSOAS');
        const matches=people.filter(p=>p.Status==='ATIVO'&&((get('pessoaId')&&p.PessoaID===get('pessoaId'))||(get('nome')&&norm_(p.Nome)===norm_(get('nome'))&&(!get('telefone')||norm_(p.Telefone)===norm_(get('telefone'))))));
        const person=matches.length===1?matches[0]:null;
        if(!person) throw new Error('A identificação da pessoa ficou ambígua ou não foi localizada. Nenhuma linha desta operação deve ser presumida.');
        const part=rows_('PARTICIPANTES').find(p=>p.ViagemID===viagemId&&p.PessoaID===person.PessoaID&&p.Status!=='CANCELADO');
        if(tipo==='participantes'){
          sheet_('PARTICIPANTES').appendRow([newId_('PV'),viagemId,person.PessoaID,'PENDENTE','','',(get('valorPrevisto')?importAmount_(get('valorPrevisto')):0),get('observacoes'),new Date(),new Date()]);
        } else {
          sheet_('PAGAMENTOS').appendRow([newId_('PG'),part.ParticipacaoID,importDateValue_(get('data')),importAmount_(get('valor')),get('forma'),get('referencia'),get('observacoes'),new Date()]);
        }
      }
      imported++;
    });
    return {importados:imported,duplicados:preview.duplicados,invalidos:preview.invalidos};
  });
}

/** Converte arquivo XLSX temporariamente para Planilhas e devolve a primeira aba como matriz. Requer serviço avançado Drive API v3. */
function readXlsxImport(base64, fileName) {
  if (typeof Drive === 'undefined' || !Drive.Files) throw new Error('Ative o serviço avançado Google Drive API no Apps Script para importar XLSX.');
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName || 'importacao.xlsx');
  let tempId = '';
  try {
    const converted = Drive.Files.create({name:'TEMP_IMPORT_SISTEMA_VIAGENS',mimeType:'application/vnd.google-apps.spreadsheet'}, blob);
    tempId = converted.id;
    const values = SpreadsheetApp.openById(tempId).getSheets()[0].getDataRange().getDisplayValues();
    return values;
  } finally {
    if (tempId) Drive.Files.update({trashed:true}, tempId);
  }
}

function setParticipantStatus(participacaoId,status){
  if(!participacaoId) throw new Error('Selecione um participante.');
  if(!['PENDENTE','CONFIRMADO'].includes(String(status||'').toUpperCase())) throw new Error('Situação inválida.');
  return withLock_(()=>{
    const sh=sheet_('PARTICIPANTES'), row=findRowById_(sh,'ParticipacaoID',participacaoId);
    if(!row) throw new Error('Participação não encontrada.');
    const current=sh.getRange(row,4).getValue();
    if(current==='CANCELADO') throw new Error('Inscrição cancelada não pode ser reativada por esta tela.');
    sh.getRange(row,4).setValue(String(status).toUpperCase());
    sh.getRange(row,10).setValue(new Date());
    return {ok:true,status:String(status).toUpperCase()};
  });
}
