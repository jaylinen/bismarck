export enum ErrorTypes {
  MUST_BE_ELDEST_HAND = 'Operation not allowed: player must be eldest hand',
  CARD_NOT_FOUND = 'Card not found',
  NO_MORE_CARDS_TO_REMOVE = 'No more cards to be removed',
  GAME_TYPE_CHOSEN = 'Game type is already chosen',
  OTHER_PLAYER_HAS_TURN = 'Other player has a turn',
  TRICK_NOT_STARTED = 'Trick is not started yet',
  MUST_FOLLOW_SUIT_AND_TRUMP = 'Suit and trump suit must be followed',
  CARDS_MUST_BE_REMOVED = 'Eldest hand must remove cards before opening trick',
  TRICK_ALREADY_STARTED = 'Trick is already ongoing',
  GAME_TYPE_NOT_CHOSEN = 'Game type is not chosen yet',
  NOT_TRICK_LEAD = 'Player is not trick lead',
}
