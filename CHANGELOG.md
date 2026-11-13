# Changelog

## 0.1.0-dev.13 — Importação inteligente e revisão de integridade

- Adicionada importação inteligente de Excel/CSV com identificação da aba pelo conteúdo dos cabeçalhos, sem depender do nome da aba.
- Somente o campo Nome é obrigatório; demais campos são opcionais e permanecem vazios quando ausentes.
- XLSX agora é lido em todas as abas e a melhor correspondência de cabeçalhos é selecionada automaticamente.
- Adicionados mapeamentos flexíveis para nome, telefone, documento, data de pagamento, valor da passagem, valor pago, forma de pagamento, saldo e observações, incluindo os cabeçalhos `Passagem`, `Pagamento` e `Saldo/Troco`.
- Adicionada revisão manual de possíveis duplicidades, conflitos de documento/telefone, nomes iguais/semelhantes e pessoas já vinculadas à viagem.
- A revisão permite mesclar com cadastro escolhido, editar dados antes de gravar, salvar como novo ou apagar somente a linha da importação atual; nenhuma duplicidade é descartada automaticamente.
- A importação inteligente cria/associa pessoas, vincula à viagem ativa, registra o valor previsto quando disponível e lança pagamentos somente quando há valor pago.
- Pagamento sem data é preservado com data em branco; campos financeiros ausentes não são inventados.
- Prévia compara saldo de origem com saldo calculado e aponta divergências.
- Reimportações verificam inscrições e pagamentos equivalentes; casos que exigem decisão devem passar por revisão manual.
- Mantida a importação antiga como opção legada para compatibilidade; se ela detectar possíveis duplicidades, bloqueia a gravação e direciona para a Importação Inteligente, evitando descartá-las silenciosamente.
- A versão DEV.12 permanece preservada como base anterior.

— Sistema de Viagens

## 0.1.0-dev.7 — 03/11/2026
- Criada programação diária de transporte vinculada à viagem, com ida e volta independentes por dia.
- Assembleia usa um dia como padrão; Congresso usa três dias consecutivos como padrão.
- Betel, território isolado e outros eventos permitem configurar a quantidade de dias e ativar somente os dias com transporte.
- Criada aba interna PROGRAMACAO e ampliado o cadastro de viagens com tipo de evento e programação diária.
- A preparação da estrutura continua não destrutiva; as novas colunas são acrescentadas ao final de VIAGENS.
- Implementação ainda não validada em planilha Google real; não instalada nem publicada.

## 0.1.0-dev.6 — 03/11/2026
- Centralizada a identificação da viagem ativa: seleção automática quando há uma única viagem e solicitação de escolha quando há mais de uma.
- Simplificado o fluxo de participantes para usar a viagem ativa, sem pedir a viagem novamente na tela de inclusão.
- Novo cadastro de pessoa pode criar automaticamente o vínculo com a viagem ativa, preservando o cadastro único.
- Criada área de importação em lote para pessoas, participantes e pagamentos, com Excel XLSX, CSV e colagem, prévia, validação, detecção de duplicidades e confirmação antes da gravação.
- Importação aditiva: não apaga nem substitui dados existentes.
- XLSX depende do serviço avançado Google Drive API v3; conversão temporária é enviada à lixeira após leitura.


## 0.1.0-dev.5 — 03/11/2026
- Incluídos tipo, número e órgão emissor do documento como campos opcionais no cadastro rápido e completo de pessoas.
- Criada atualização de cadastro existente para completar ou corrigir os dados posteriormente.
- Preparação da estrutura passa a acrescentar as novas colunas de documento ao final da aba PESSOAS, sem apagar os registros existentes.

# Histórico de versões

## 0.1.0-dev.4 — 2026-11-03
- Reconstruída a interface com navegação lateral e telas separadas, seguindo a composição visual das três referências oficiais.
- O painel passou a abrir em janela ampla (diálogo) em vez da barra lateral estreita do Planilhas.
- Incluídos painel principal, cadastro de pessoas, viagens, inscrição, pagamentos, veículos, mapa de assentos, relatórios, pesquisa e configurações.
- Padronizado o nome oficial do produto como Sistema de Viagens em toda a interface e documentação.
- Atualizada a identificação e versão do backend; operações e estrutura de dados anteriores foram preservadas.
- Mantidos os cadastros vazios e a regra de não importar dados antigos.
- Não houve instalação, publicação nem teste em planilha Google real.
- Campos e funções ainda não suportados pelo backend (como foto/endereço de pessoa e persistência das configurações) permanecem pendentes.

## Referências visuais oficiais — 2026-11-03
- Confirmadas as três imagens enviadas pelo usuário como referências visuais oficiais de layout.
- Confirmado o nome oficial do produto: Sistema de Viagens.
- Atualizados README e docs/REFERENCIA_VISUAL.md para apontar às imagens preservadas na raiz do repositório.
- A referência HTML antiga index(3).html não corresponde às prévias de hoje e não deve orientar a implementação visual.
- Nenhuma imagem foi editada; nenhum dado antigo foi importado.

## 0.1.0-dev.3 — 2026-11-03
- Criada consulta central para seis documentos: lista geral, por veículo/assento, capitão, pagamentos, confirmados e resumo geral.
- Interface de relatórios passou a permitir selecionar o documento e visualizar a prévia antes de imprimir.
- Impressão configurada para papel A4, com orientação retrato ou paisagem.
- Corrigido erro de sintaxe na montagem da lista de participantes do formulário de pagamentos.
- Datas dos relatórios convertidas para texto antes do retorno à interface.
- Adicionado controle na interface para marcar participantes como PENDENTE ou CONFIRMADO; a lista de confirmados passa a utilizar esse status.
- Implementação ainda não executada em uma planilha Google real.

## 0.1.0-dev.2 — 2026-11-03
- Incluídos formulários iniciais de pessoas, viagens, inscrições, veículos e pagamentos.
- Incluída consulta do mapa de assentos e atribuição de lugar.
- Incluída prévia básica de resumo da viagem e impressão pelo navegador.
- Corrigida realocação de participante para liberar o assento anterior.
- Adicionado roteiro de testes manuais.
- Ainda não há planilha Google real criada ou publicada.

## 0.1.0-dev.1 — 2026-11-03
- Criada a documentação inicial e arquitetura técnica.
- Criado backend Apps Script com preparação não destrutiva da estrutura.
- Criadas operações iniciais para pessoas, viagens, inscrições, pagamentos e veículos/assentos.
- Criada interface lateral protótipo com formulários de cadastro.
- Nenhum dado de pessoas ou viagens foi inserido.
