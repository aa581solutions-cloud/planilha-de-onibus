# Especificação funcional — Sistema de Viagens

**Estado:** requisitos consolidados para desenvolvimento  
**Plataforma oficial:** Google Planilhas + Google Apps Script  
**Dados iniciais:** vazios  
**Referências permitidas:** instruções, decisões e prévias visuais aprovadas pelo usuário  
**Proibição:** não consultar, importar, copiar ou usar arquivos antigos como referência.

## 1. Objetivo

Construir uma solução de gestão de viagens e transporte que opere continuamente no Google Planilhas, mas seja utilizada como um sistema: telas, formulários, botões, navegação, consultas e relatórios. O usuário não deve precisar trabalhar diretamente com linhas, colunas ou fórmulas no uso normal.

## 2. Diretrizes obrigatórias

1. Google Planilhas é a plataforma principal e permanente; não desenvolver uma solução Excel como produto principal.
2. Reproduzir fielmente o visual e a funcionalidade das prévias aprovadas. Não substituir por uma interface simplificada ou apenas inspirada.
3. Iniciar com a estrutura totalmente vazia. O usuário fará todos os cadastros manualmente.
4. Não importar os 77 registros ou quaisquer outros dados de versões anteriores.
5. Não utilizar arquivos antigos como referência técnica ou visual.
6. Manter os dados centralizados, sem duplicar bases para relatórios.
7. Preservar cadastros e históricos. Cancelamentos e retiradas devem mudar o status, não apagar registros.
8. Não executar exclusões, publicar em produção ou realizar mudanças destrutivas sem autorização explícita.
9. Registrar decisões, versões e alterações neste repositório.

## 3. Interface

- Tema azul e branco.
- Menu lateral com ícones.
- Painel principal com cartões e indicadores.
- Formulários de cadastro e edição.
- Navegação entre telas por controles da própria interface.
- Pesquisa e consulta.
- Botões para executar ações e gerar relatórios.
- Aparência de sistema, ocultando a estrutura tabular e fórmulas durante o uso normal.
- A implementação visual deve corresponder exatamente às prévias aprovadas pelo usuário.

## 4. Telas previstas

1. Painel principal.
2. Cadastro de pessoas.
3. Inscrição na viagem.
4. Registro e histórico de pagamentos.
5. Gerenciamento de veículos.
6. Mapa de assentos.
7. Relatórios.
8. Pesquisa e consulta.
9. Configurações.
10. Impressão das listas gerais.
11. Pré-visualização dos documentos antes de imprimir ou salvar em PDF.

## 5. Estrutura lógica de dados

A estrutura deve evitar fontes paralelas e duplicação de dados:

- **PESSOAS:** cadastro único de cada pessoa.
- **VIAGENS:** um registro por viagem/evento.
- **PARTICIPANTES:** vínculo entre pessoa e viagem; a mesma pessoa pode participar de viagens diferentes, mas não deve ser inscrita duas vezes na mesma viagem.
- **PAGAMENTOS:** histórico de lançamentos por participação; parcelas não devem sobrescrever pagamentos anteriores.
- **VEÍCULOS:** veículos associados à viagem, incluindo ônibus, vans e carros.
- **ASSENTOS:** lugares vinculados à viagem e ao veículo, com situação e ocupante.
- **PAINEL:** indicadores calculados a partir das tabelas principais e filtrados pela viagem selecionada.

Nomes e demais dados de pessoas devem ter uma fonte única no cadastro PESSOAS. Relatórios devem ser derivados das tabelas principais.

## 6. Regras de negócio

- Impedir duplicidade de inscrição da mesma pessoa na mesma viagem.
- Permitir que uma pessoa participe de várias viagens.
- Permitir diferentes tipos e quantidades de veículos, sem presumir dois ônibus fixos.
- Controlar ocupação e disponibilidade de assentos por viagem e veículo.
- Registrar pagamentos em histórico; calcular total pago e saldo.
- Retirada ou cancelamento não apaga cadastro nem histórico financeiro.
- Não deduplicar automaticamente pessoas com nomes semelhantes ou expressões como “Família de...”; casos ambíguos precisam de confirmação.
- Manter histórico de inclusões e correções.

## 7. Listas e impressão

Disponibilizar visualização online, impressão e salvamento em PDF para:

- Lista geral de participantes.
- Lista por veículo e assento.
- Lista do capitão.
- Lista de pagamentos.
- Lista de passageiros confirmados.
- Resumo geral da viagem.

A pré-visualização deve permitir conferir o documento antes de imprimir ou salvar em PDF. Oferecer papel A4 e orientação retrato ou paisagem quando aplicável.

## 8. Estado inicial e critérios de aceite

A primeira versão deve começar sem pessoas, viagens, participantes, pagamentos, veículos ou ocupações de assentos cadastrados. Nenhum dado antigo será migrado.

A entrega será considerada conforme quando:
- abrir e operar no Google Planilhas;
- apresentar a interface aprovada, fiel às prévias;
- permitir cadastros manuais pelos formulários;
- executar as regras de duplicidade, histórico, pagamentos e assentos;
- gerar as listas previstas com pré-visualização, impressão e PDF;
- manter os dados em uma fonte coerente, sem bases redundantes.

## 9. Fora do escopo desta etapa

- Importação de registros antigos.
- Uso de arquivos antigos como modelo ou referência.
- Publicação em ambiente de produção sem aprovação.
- Inserção automática de dados de pessoas ou viagens.

## 10. Controle de alterações

Toda mudança de requisito deve ser registrada aqui ou em documento complementar, indicando a decisão que a autorizou. Em caso de divergência, prevalece a instrução mais recente e explicitamente confirmada pelo usuário.
