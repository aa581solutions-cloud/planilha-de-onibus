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
