# Arquitetura técnica — versão inicial

## Princípios
- Google Planilhas é o armazenamento operacional.
- Google Apps Script implementa validações, regras de negócio, menus e interface.
- As abas de dados são tabelas internas; a operação cotidiana ocorre por telas/formulários.
- Relatórios são consultas às tabelas oficiais, nunca cópias mantidas manualmente.
- A inicialização é não destrutiva: não apaga nem substitui dados existentes.

## Abas internas
| Aba | Finalidade |
|---|---|
| PAINEL | Entrada e indicadores da viagem selecionada |
| PESSOAS | Cadastro único de pessoas |
| VIAGENS | Cadastro de viagens |
| PARTICIPANTES | Vínculo pessoa/viagem e status |
| PAGAMENTOS | Lançamentos financeiros por participação |
| VEICULOS | Veículos vinculados à viagem |
| ASSENTOS | Lugares por veículo e viagem |
| CONFIG | Parâmetros gerais |

As abas de dados poderão ficar ocultas quando a interface de operação estiver pronta. Não ocultar nem proteger de forma que impeça manutenção autorizada.

## IDs e integridade
- IDs são gerados pelo Apps Script.
- Uma pessoa pode estar em várias viagens.
- A combinação ViagemID + PessoaID é única em PARTICIPANTES.
- Pagamentos são lançamentos imutáveis; correções devem ser lançamentos de estorno/ajuste documentados, não sobrescrita silenciosa.
- Assentos são únicos por ViagemID + VeiculoID + NumeroAssento.
- Um assento ocupado não pode ser atribuído a outra participação.
- Cancelar/remover participante altera status e preserva pagamentos e cadastro.

## Fluxo de implementação
1. Criar e validar abas e cabeçalhos sem inserir registros.
2. Implementar operações e validações no Apps Script.
3. Implementar formulários e navegação da interface aprovada.
4. Implementar consultas, prévias de impressão e PDF.
5. Testar com dados fictícios temporários em cópia de teste; a base oficial permanece vazia.
6. Preparar instruções de instalação e autorização do Apps Script.

## Limite atual
O código-fonte será versionado neste repositório. A criação de uma planilha real na conta Google e a autorização/publicação do Apps Script dependem de acesso à conta Google do usuário; não serão simuladas.


## Viagem ativa e importação
- A interface mantém um contexto único de viagem ativa, selecionado automaticamente quando há uma única viagem e exigido quando existem várias.
- Inclusões rápidas de pessoas criam o cadastro único e, quando informada a viagem ativa, o vínculo de participação correspondente.
- Importações em lote são validadas antes da gravação e nunca substituem linhas existentes.
- A leitura de XLSX usa o serviço avançado Google Drive API v3 para conversão temporária; a cópia temporária é enviada à lixeira após a leitura.


## Programação de transporte por dia
- Nova aba interna PROGRAMACAO, com uma linha por dia do período de cada viagem.
- Campos: ProgramacaoID, ViagemID, Data, DiaAtivo, HoraIda, HoraVolta, Ordem e CriadoEm.
- A aba VIAGENS guarda TipoEvento e DiasProgramados, acrescentados ao final para compatibilidade com a estrutura existente.
- A tela de cadastro gera os dias a partir da data inicial e quantidade de dias; Assembleia define um dia e Congresso define três dias como padrão.
- Betel, território isolado e outros eventos permitem período configurável e seleção individual dos dias com transporte.
- A lista diária fica relacionada por ViagemID; relatórios futuros devem consultar essa programação para detalhar saídas e retornos.
- A preparação da estrutura deve criar PROGRAMACAO e acrescentar colunas novas ao final de VIAGENS, sem apagar registros existentes.
