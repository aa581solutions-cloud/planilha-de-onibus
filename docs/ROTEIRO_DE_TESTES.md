# Roteiro de testes — versão 0.1.0-dev.3

**Importante:** executar somente em uma planilha descartável de desenvolvimento. A planilha oficial deve continuar vazia até autorização.

## Preparação
- [ ] Criar uma planilha Google vazia de teste.
- [ ] Instalar os arquivos do Apps Script conforme o guia.
- [ ] Executar a preparação e conferir que as abas foram criadas sem registros.
- [ ] Executar a preparação novamente e conferir que não duplicou cabeçalhos nem apagou conteúdo.

## Cadastros e inscrições
- [ ] Cadastrar uma pessoa sem telefone.
- [ ] Cadastrar duas pessoas homônimas sem telefone e confirmar que o sistema não bloqueia automaticamente o caso ambíguo.
- [ ] Tentar duplicar nome + telefone ativo e conferir a validação.
- [ ] Cadastrar viagem.
- [ ] Inscrever pessoa na viagem.
- [ ] Tentar inscrever a mesma pessoa novamente na mesma viagem e conferir o bloqueio.
- [ ] Inscrever a mesma pessoa em outra viagem e conferir que é permitido.

## Veículos e assentos
- [ ] Cadastrar ônibus, van e carro com capacidades diferentes.
- [ ] Conferir a criação da quantidade correta de assentos.
- [ ] Atribuir assento a participante.
- [ ] Tentar ocupar o mesmo assento com outra pessoa e conferir o bloqueio.
- [ ] Mover participante para outro assento e conferir que o anterior fica livre.
- [ ] Cancelar participação e conferir que o assento é liberado sem apagar o cadastro ou pagamentos.

## Pagamentos e relatórios
- [ ] Registrar mais de um pagamento para a mesma participação.
- [ ] Conferir total pago e saldo.
- [ ] Conferir o resumo da viagem.
- [ ] Conferir pré-visualização e impressão/salvamento em PDF no navegador.

## Listas e impressão
- [ ] Gerar a lista geral e conferir ordenação por nome.
- [ ] Gerar a lista por veículo/assento e conferir ordenação.
- [ ] Gerar a lista do capitão e conferir passageiros alocados.
- [ ] Gerar a lista de pagamentos e conferir cada lançamento sem sobrescrever histórico.
- [ ] Marcar e desmarcar participantes como confirmados pela interface e conferir a lista de confirmados.
- [ ] Gerar o resumo geral e conferir indicadores, veículos e valores.
- [ ] Conferir prévia antes de imprimir.
- [ ] Imprimir em A4 retrato e A4 paisagem e salvar em PDF.

## Critérios de aprovação
Todos os testes devem passar sem dados de produção. Falhas devem ser corrigidas e registradas antes de considerar a versão pronta.


## Seleção da viagem ativa
- [ ] Sem viagens, conferir orientação para criar a primeira.
- [ ] Com uma viagem, conferir seleção automática.
- [ ] Com duas viagens, conferir solicitação de identificação e que nenhum módulo opere sem escolha.
- [ ] Conferir que pagamentos, veículos, assentos e relatórios acompanham a viagem ativa.
- [ ] Cadastrar pessoa nova com viagem ativa e conferir criação do cadastro único e do vínculo em PARTICIPANTES.
- [ ] Adicionar pessoa já cadastrada à viagem ativa sem duplicar PESSOAS.

## Importação em lote
- [ ] Importar CSV e dados colados de pessoas com cabeçalhos reconhecidos.
- [ ] Importar XLSX após ativar Google Drive API v3 no projeto Apps Script.
- [ ] Conferir prévia, duplicidades e linhas inválidas antes da gravação.
- [ ] Confirmar que cancelar a prévia não grava nada.
- [ ] Importar participantes somente para a viagem ativa e bloquear duplicidade de vínculo.
- [ ] Importar pagamentos somente para participantes já vinculados e preservar todos os lançamentos.
- [ ] Conferir que nenhuma importação apaga ou substitui registros existentes.


## Programação diária de transporte — DEV.7
- [ ] Criar Assembleia e conferir um único dia com ida pela manhã e volta à tarde.
- [ ] Criar Congresso e conferir três dias consecutivos, cada um com ida e volta.
- [ ] Alterar horários de ida e volta individualmente em cada dia do Congresso.
- [ ] Criar Betel com período de vários dias e desativar dias sem transporte.
- [ ] Criar Território isolado com dias de transporte não consecutivos.
- [ ] Criar evento personalizado com quantidade de dias configurada.
- [ ] Tentar salvar dia ativo sem ida ou sem volta e conferir bloqueio.
- [ ] Tentar configurar volta anterior ou igual à ida e conferir bloqueio.
- [ ] Conferir que cada dia de programação fica ligado à ViagemID correta.
- [ ] Executar a preparação duas vezes e confirmar que PROGRAMACAO e novas colunas não duplicam nem apagam dados.
- [ ] Conferir que viagens já existentes continuam listadas e acessíveis.
