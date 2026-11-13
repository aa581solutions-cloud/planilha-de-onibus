/**
 * Importação inteligente — DEV.13
 * Identifica a aba e as colunas pelos cabeçalhos; somente Nome é obrigatório.
 */

function smartHeaderKey_(value) {
  return norm_(value).replace(/[^a-z0-9]/g, '');
}

function smartAliases_() {
  return {
    nome: ['nome','nomecompleto','passageiro','pessoa','nomedopassageiro','nomedapessoa'],
    telefone: ['telefone','celular','whatsapp','fone','numerodetelefone','numerodotelefone','contato'],
    documento: ['documento','documentodapessoa','cpf','cnpj','rg','numerodocumento','numerododocumento','documentoidentidade','identidade'],
    tipoDocumento: ['tipodocumento','tipode documento','tipodedocumento'],
    dataPagamento: ['datapagamento','datadepagamento','data','datadopagamento','pagamentoem','datapagto','datapagamento'],
    valorPassagem: ['valorpassagem','valordapassagem','passagem','valorprevisto','valortotal','valorviagem'],
    valorPago: ['valorpago','totalpago','valordopagamento','valorrecebido','valorpagto','pago'],
    formaPagamento: ['formapagamento','formadepagamento','meiodepagamento','forma','tipopagamento'],
    saldo: ['saldo','saldoapagar','valorpedente','restante','valoremaberto'],
    observacoes: ['observacoes','observacao','obs','notas','comentarios','comentario'],
    numeroInscricao: ['numeroinscricao','numerodainscricao','inscricao','inscricaonumero','ninscricao','numero','n']
  };
}

function smartFindHeader_(values) {
  const aliases = smartAliases_();
  let best = null;
  const scan = Math.min(values.length, 20);
  for (let r = 0; r < scan; r++) {
    const keys = (values[r] || []).map(smartHeaderKey_);
    const mapped = {};
    Object.keys(aliases).forEach(field => {
      mapped[field] = keys.findIndex(k => aliases[field].some(a => smartHeaderKey_(a) === k));
    });
    const score = Object.keys(mapped).filter(k => mapped[k] >= 0).length;
    if (mapped.nome >= 0 && (!best || score > best.score)) best = {row:r, columns:mapped, score:score, headers:values[r]};
  }
  return best;
}

function smartValue_(line, index) {
  return index >= 0 && index < line.length ? clean_(line[index]) : '';
}

function smartDigits_(value) {
  return String(value || '').replace(/\D/g, '');
}

function smartDate_(value) {
  if (value === '' || value == null) return '';
  if (value instanceof Date && !isNaN(value.getTime())) return Utilities.formatDate(value,Session.getScriptTimeZone(),'yyyy-MM-dd');
  const s = clean_(value);
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]));
    if(d.getFullYear()!==Number(m[3]) || d.getMonth()!==Number(m[2])-1 || d.getDate()!==Number(m[1])) throw new Error('Data de pagamento inválida: '+s);
    return m[3]+'-'+m[2]+'-'+m[1];
  }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
    if(d.getFullYear()!==Number(m[1]) || d.getMonth()!==Number(m[2])-1 || d.getDate()!==Number(m[3])) throw new Error('Data de pagamento inválida: '+s);
    return m[1]+'-'+m[2]+'-'+m[3];
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) throw new Error('Data de pagamento inválida: ' + s);
  return Utilities.formatDate(d,Session.getScriptTimeZone(),'yyyy-MM-dd');
}

function smartMoney_(value) {
  if (value === '' || value == null) return null;
  const n = importAmount_(value);
  if (!Number.isFinite(n) || n < 0) throw new Error('Valor financeiro inválido: ' + value);
  return n;
}

function smartAnalyzeSheets_(sheets) {
  if (!Array.isArray(sheets) || !sheets.length) throw new Error('Nenhuma aba ou tabela foi encontrada no arquivo.');
  const candidates = [];
  sheets.forEach((sheet, sheetIndex) => {
    const values = Array.isArray(sheet.values) ? sheet.values : [];
    const header = smartFindHeader_(values);
    if (header) candidates.push({sheetName:sheet.name || ('Aba ' + (sheetIndex+1)),sheetIndex:sheetIndex,values:values,header:header});
  });
  if (!candidates.length) throw new Error('Não encontrei uma linha de cabeçalho com a coluna Nome. Verifique se a planilha contém esse campo.');
  candidates.sort((a,b)=>b.header.score-a.header.score);
  const chosen = candidates[0];
  const col = chosen.header.columns;
  const people = rows_('PESSOAS').filter(p=>p.Status!=='INATIVO');
  const output = [];
  const seenSourceNames = new Set();
  for (let i=chosen.header.row+1;i<chosen.values.length;i++) {
    const line=chosen.values[i] || [];
    if (!line.some(v=>clean_(v)!=='')) continue;
    const row = {
      rowId: chosen.sheetIndex+':'+i,
      sourceRow: i+1,
      nome: smartValue_(line,col.nome),
      telefone: smartValue_(line,col.telefone),
      documento: smartValue_(line,col.documento),
      tipoDocumento: smartValue_(line,col.tipoDocumento),
      dataPagamento: smartValue_(line,col.dataPagamento),
      valorPassagem: smartValue_(line,col.valorPassagem),
      valorPago: smartValue_(line,col.valorPago),
      formaPagamento: smartValue_(line,col.formaPagamento),
      saldo: smartValue_(line,col.saldo),
      observacoes: smartValue_(line,col.observacoes),
      numeroInscricao: smartValue_(line,col.numeroInscricao)
    };
    if (!row.nome) {
      output.push({...row,status:'ERRO',motivo:'Nome não informado; esta linha não pode ser importada.',candidatos:[]});
      continue;
    }
    const doc=smartDigits_(row.documento), phone=smartDigits_(row.telefone), name=norm_(row.nome);
    if (seenSourceNames.has(name) && !doc && !phone) { output.push({...row,status:'REVISAR',motivo:'Nome repetido no próprio arquivo; confirme se é a mesma pessoa.',candidatos:[]}); continue; }
    seenSourceNames.add(name);
    const exactDoc=doc?people.filter(p=>smartDigits_(p.NumeroDocumento)===doc):[];
    const exactPhone=phone?people.filter(p=>smartDigits_(p.Telefone)===phone):[];
    let candidates=[];
    let status='NOVO',motivo='Nenhum cadastro correspondente encontrado.';
    if (exactDoc.length===1 && exactPhone.length===1 && exactDoc[0].PessoaID!==exactPhone[0].PessoaID) {
      candidates=[exactDoc[0],exactPhone[0]];status='REVISAR';motivo='Documento e telefone apontam para cadastros diferentes; confira antes de associar.';
    }
    else if (exactDoc.length===1 && phone && smartDigits_(exactDoc[0].Telefone) && smartDigits_(exactDoc[0].Telefone)!==phone) {
      candidates=exactDoc;status='REVISAR';motivo='Documento coincide, mas o telefone diverge do cadastro existente.';
    }
    else if (exactPhone.length===1 && doc && smartDigits_(exactPhone[0].NumeroDocumento) && smartDigits_(exactPhone[0].NumeroDocumento)!==doc) {
      candidates=exactPhone;status='REVISAR';motivo='Telefone coincide, mas o documento diverge do cadastro existente.';
    }
    else if (exactDoc.length===1) {candidates=exactDoc;status='ASSOCIAR';motivo='Documento coincide com um cadastro existente.';}
    else if (exactDoc.length>1) {candidates=exactDoc;status='REVISAR';motivo='Documento aparece em mais de um cadastro.';}
    else if (exactPhone.length===1) {candidates=exactPhone;status='ASSOCIAR';motivo='Telefone coincide com um cadastro existente.';}
    else if (exactPhone.length>1) {candidates=exactPhone;status='REVISAR';motivo='Telefone aparece em mais de um cadastro.';}
    else {
      candidates=people.filter(p=>{
        const existing=norm_(p.Nome);
        return existing===name || existing.startsWith(name+' ') || name.startsWith(existing+' ') || (name.split(' ').some(t=>t.length>=4 && existing.split(' ').includes(t)) && Math.min(name.length,existing.length)/Math.max(name.length,existing.length)>.55);
      });
      if (candidates.length) {status='REVISAR';motivo='Nome igual ou semelhante; confirme se é a mesma pessoa ou um homônimo.';}
    }
    let fare=null, paid=null, date='';
    try { fare=smartMoney_(row.valorPassagem); paid=smartMoney_(row.valorPago); if(row.dataPagamento) date=smartDate_(row.dataPagamento); row.saldoOrigemNum=row.saldo===''?null:smartMoney_(row.saldo); }
    catch(e) { status='ERRO'; motivo=e.message; }
    if (status!=='ERRO') {
      row.valorPassagemNum=fare;
      row.valorPagoNum=paid;
      row.dataPagamentoValue=date;
      row.saldoCalculado=fare==null?null:Math.max(0,fare-(paid||0));
      row.divergenciaSaldo=row.saldoOrigemNum!=null && row.saldoCalculado!=null && Math.abs(row.saldoOrigemNum-row.saldoCalculado)>0.01;
      row.candidatos=candidates.map(p=>({id:p.PessoaID,nome:p.Nome,telefone:p.Telefone||'',documento:p.NumeroDocumento||''}));
      row.status=status;row.motivo=motivo;
    }
    output.push(row);
  }
  return {abaEscolhida:chosen.sheetName,abasAnalisadas:sheets.map(s=>s.name),campos:Object.keys(col).filter(k=>col[k]>=0),camposAusentes:Object.keys(col).filter(k=>col[k]<0),total:output.length,novos:output.filter(x=>x.status==='NOVO').length,revisar:output.filter(x=>x.status==='REVISAR').length,associar:output.filter(x=>x.status==='ASSOCIAR').length,erros:output.filter(x=>x.status==='ERRO').length,linhas:output};
}

function previewSmartImport(viagemId, sheets) {
  if (!viagemId) throw new Error('Selecione a viagem que receberá os participantes.');
  if (!rows_('VIAGENS').some(t=>t.ViagemID===viagemId && t.Status!=='CANCELADA' && t.Status!=='ARQUIVADA')) throw new Error('Viagem não encontrada ou indisponível.');
  const result=smartAnalyzeSheets_(sheets);
  result.linhas.forEach(line=>{
    if(line.status==='ERRO') return;
    const existing=rows_('PARTICIPANTES').find(p=>p.ViagemID===viagemId && p.Status!=='CANCELADO' && line.candidatos.some(c=>c.id===p.PessoaID));
    if(line.status==='ASSOCIAR' && existing){line.jaInscrito=true;line.motivo='Pessoa já vinculada à viagem; os dados financeiros novos ainda serão conferidos.';}
    if(line.status==='NOVO'){
      const existingName=rows_('PESSOAS').filter(p=>p.Status!=='INATIVO' && norm_(p.Nome)===norm_(line.nome));
      if(existingName.length){line.status='REVISAR';line.motivo='Já existe pessoa com este nome; confirme se é a mesma pessoa.';line.candidatos=existingName.map(p=>({id:p.PessoaID,nome:p.Nome,telefone:p.Telefone||'',documento:p.NumeroDocumento||''}));}
    }
    line.financeiro={previsto:line.valorPassagemNum,pago:line.valorPagoNum,saldoOrigem:line.saldoOrigemNum,saldoCalculado:line.saldoCalculado,divergenciaSaldo:!!line.divergenciaSaldo};
  });
  result.viagemId=viagemId;
  result.prontos=result.linhas.filter(x=>['NOVO','ASSOCIAR'].includes(x.status)).length;
  result.duplicados=result.linhas.filter(x=>x.status==='DUPLICADO').length;
  result.pendentes=result.linhas.filter(x=>x.status==='REVISAR').length;
  return result;
}

function applySmartImport(viagemId, sheets, decisions) {
  return withLock_(()=>{
    const preview=previewSmartImport(viagemId,sheets);
    const choice=decisions || {};
    const unresolved=preview.linhas.filter(x=>x.status==='REVISAR' && !choice[x.rowId]);
    if(unresolved.length) throw new Error('Há '+unresolved.length+' possível(is) duplicidade(s) sem decisão. Escolha associar ou cadastrar como pessoa nova.');
    let imported=0,created=0,linked=0,payments=0,duplicates=preview.duplicados;
    const peopleSheet=sheet_('PESSOAS'), participantSheet=sheet_('PARTICIPANTES'), paymentSheet=sheet_('PAGAMENTOS');
    preview.linhas.forEach(line=>{
      if(line.status==='ERRO'||line.status==='DUPLICADO') return;
      const decision=choice[line.rowId] || (line.status==='ASSOCIAR' ? line.candidatos[0].id : 'new');
      if(decision==='skip') return;
      let person=null;
      if(decision==='new') {
        const existing=rows_('PESSOAS').filter(p=>p.Status!=='INATIVO' && norm_(p.Nome)===norm_(line.nome));
        if(existing.length && line.status!=='REVISAR') throw new Error('O cadastro '+line.nome+' mudou após a prévia. Gere uma nova prévia.');
        const id=newId_('P');
        peopleSheet.appendRow([id,line.nome,line.telefone,line.observacoes,new Date(),new Date(),'ATIVO',line.tipoDocumento,line.documento,'']);
        person={PessoaID:id,Nome:line.nome,Telefone:line.telefone,NumeroDocumento:line.documento};
        created++;
      } else {
        person=rows_('PESSOAS').find(p=>p.PessoaID===decision);
        if(!person || (line.candidatos.length && !line.candidatos.some(c=>c.id===decision))) throw new Error('A pessoa escolhida não corresponde aos candidatos apresentados. Gere uma nova prévia.');
        const row=findRowById_(peopleSheet,'PessoaID',person.PessoaID);
        const headers=peopleSheet.getRange(1,1,1,peopleSheet.getLastColumn()).getDisplayValues()[0];
        const fill=(field,value)=>{const col=headers.indexOf(field)+1;if(col>0 && value && !clean_(peopleSheet.getRange(row,col).getValue()))peopleSheet.getRange(row,col).setValue(value);};
        fill('Telefone',line.telefone);fill('NumeroDocumento',line.documento);fill('TipoDocumento',line.tipoDocumento);fill('Observacoes',line.observacoes);
      }
      let part=rows_('PARTICIPANTES').find(p=>p.ViagemID===viagemId && p.PessoaID===person.PessoaID && p.Status!=='CANCELADO');
      if(!part) {
        const fare=line.valorPassagemNum==null?'':line.valorPassagemNum;
        const id=newId_('PV');
        participantSheet.appendRow([id,viagemId,person.PessoaID,'PENDENTE','','',fare,line.observacoes,new Date(),new Date(),line.numeroInscricao]);
        part={ParticipacaoID:id,ValorPrevisto:fare};linked++;
      } else {
        const row=findRowById_(participantSheet,'ParticipacaoID',part.ParticipacaoID);
        const headers=participantSheet.getRange(1,1,1,participantSheet.getLastColumn()).getDisplayValues()[0];
        if(line.valorPassagemNum!=null && Number(part.ValorPrevisto||0)===0) participantSheet.getRange(row,7).setValue(line.valorPassagemNum);
        const numCol=headers.indexOf('NumeroInscricao')+1;
        if(numCol>0 && line.numeroInscricao && !clean_(participantSheet.getRange(row,numCol).getValue())) participantSheet.getRange(row,numCol).setValue(line.numeroInscricao);
      }
      if(line.valorPagoNum!=null && line.valorPagoNum>0) {
        const date=line.dataPagamentoValue ? importDateValue_(line.dataPagamentoValue) : '';
        const signature=[part.ParticipacaoID,date?importDateKey_(date):'',line.valorPagoNum,norm_(line.formaPagamento),norm_(line.observacoes)].join('|');
        const already=rows_('PAGAMENTOS').some(p=>[p.ParticipacaoID,importDateKey_(p.Data),Number(p.Valor||0),norm_(p.Forma),norm_(p.Observacoes)].join('|')===signature);
        if(!already) {
          paymentSheet.appendRow([newId_('PG'),part.ParticipacaoID,date,line.valorPagoNum,line.formaPagamento,'',line.observacoes,new Date()]);
          payments++;
        } else duplicates++;
      }
      imported++;
    });
    SpreadsheetApp.flush();
    return {importados:imported,pessoasCriadas:created,participantesVinculados:linked,pagamentosCriados:payments,duplicados:duplicates,erros:preview.erros,aba:preview.abaEscolhida};
  });
}

/** Lê todas as abas do XLSX convertido temporariamente; a seleção ocorre pelos cabeçalhos. */
function readXlsxImport(base64, fileName) {
  if (typeof Drive === 'undefined' || !Drive.Files) {
    throw new Error('A leitura de Excel não está habilitada. Adicione o serviço avançado Drive API v3 no Apps Script. CSV também é aceito.');
  }
  const bytes=Utilities.base64Decode(base64);
  const blob=Utilities.newBlob(bytes,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',fileName||'importacao.xlsx');
  let tempId='';
  try {
    const converted=Drive.Files.create({name:'TEMP_IMPORT_SISTEMA_VIAGENS',mimeType:'application/vnd.google-apps.spreadsheet'},blob);
    tempId=converted.id;
    const ss=SpreadsheetApp.openById(tempId);
    return {sheets:ss.getSheets().map(sh=>({name:sh.getName(),values:sh.getDataRange().getDisplayValues()}))};
  } finally {
    if(tempId) Drive.Files.update({trashed:true},tempId);
  }
}


/** Testes puros da importação inteligente; não leem nem alteram a planilha. */
function runSmartImportSelfTests() {
  const results=[];
  const check=(name,fn)=>{
    try { if(!fn()) throw new Error('Resultado inesperado'); results.push({teste:name,status:'OK'}); }
    catch(e) { results.push({teste:name,status:'FALHOU',erro:e.message}); }
  };
  check('Cabeçalho apenas com Nome',()=>smartFindHeader_([['Nome'],['Maria']]).columns.nome===0);
  check('Cabeçalhos com variações e acentos',()=>{
    const h=smartFindHeader_([['Nome da Pessoa','Data de Pagamento','Valor da Passagem','Valor Pago','Forma de Pagamento','Saldo','Documento','Telefone','Observações','Nº']]);
    return h && h.columns.nome===0 && h.columns.dataPagamento===1 && h.columns.valorPassagem===2 &&
      h.columns.valorPago===3 && h.columns.formaPagamento===4 && h.columns.saldo===5 &&
      h.columns.documento===6 && h.columns.telefone===7 && h.columns.observacoes===8 && h.columns.numeroInscricao===9;
  });
  check('Valor monetário brasileiro',()=>Math.abs(smartMoney_('R$ 1.234,50')-1234.5)<0.001);
  check('Data brasileira',()=>smartDate_('13/11/2026')==='2026-11-13');
  check('Campo opcional vazio',()=>smartMoney_('')===null && smartDate_('')==='');
  return {total:results.length,aprovados:results.filter(x=>x.status==='OK').length,results:results};
}
