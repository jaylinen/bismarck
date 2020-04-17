import { CardManager } from './card-manager';

test('Ensure deals correct amount of cards', () => {
  const cardManager = new CardManager();

  expect(cardManager.getPlayersCards(0).length).toBe(16);
  expect(cardManager.getPlayersCards(1).length).toBe(12);
  expect(cardManager.getPlayersCards(2).length).toBe(12);
  expect(cardManager.getPlayersCards(3).length).toBe(12);
});

test('Ensure returns four table cards', () => {
  const cardManager = new CardManager();

  const actual = cardManager.getTableCards();

  expect(actual.length).toBe(4);
});

test('Ensure removed card is not in players hand after removal', () => {
  const player = 0;
  const cardManager = new CardManager();
  const cards = cardManager.getPlayersCards(player);

  const cardToBeRemoved = cards[0].presentation();

  cardManager.removeCard(cardToBeRemoved.rank, cardToBeRemoved.suit);

  expect(cardManager.getPlayersCards(player).length).toBe(cards.length - 1);
  expect(
    cardManager
      .getPlayersCards(player)
      .filter((x) => x.equals(cardToBeRemoved.rank, cardToBeRemoved.suit))
      .length
  ).toBe(0);
});

test('Ensure getting players card', () => {
  const player = 2;
  const cardManager = new CardManager();
  const cards = cardManager.getPlayersCards(player);

  const expected = cards[3];

  expect(
    cardManager.getCardFromPlayersHand(
      player,
      expected.presentation().rank,
      expected.presentation().suit
    )
  ).toBe(expected);
});
