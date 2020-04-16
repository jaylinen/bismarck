import * as statuses from 'http-status-codes';

import { CardEntity } from './card-entity';
import { TrickEntity } from './trick-entity';
import { Player } from './player';
import { HandScore } from './hand-score';
import { Card } from '../types/card';

type CardContainer = {
  card: CardEntity;
  isPlayed: boolean;
};

export class HandEntity {
  private readonly PLAYERS = 4;
  private readonly CARDS_IN_HAND = 12;

  private _cards: CardContainer[];

  private _players: Player[];

  private _currentTrick: TrickEntity;

  private _handScore: HandScore;

  constructor(shuffledCards: number[], players: Player[]) {
    this._cards = [];
    shuffledCards
      .map((value: number) => {
        return {
          card: new CardEntity(value),
          isPlayed: false,
        } as CardContainer;
      })
      .forEach((card) => this._cards.push(card));
    this._players = players;
    this._handScore = new HandScore(players);
  }

  public getCards(player: Player): Card[] {
    const playerIndex = this.getPlayersIndex(player);
    return this.cardsInPlayersHand(playerIndex).map((x) =>
      x.card.presentation()
    );
  }

  public removeCard(player: Player, rank: string, suit: string) {
    if (!player.equals(this.getEldestHand())) {
      throw statuses.FORBIDDEN;
    }

    const playerIndex = this.getPlayersIndex(player);

    if (this.cardsInPlayersHand(playerIndex).length <= this.CARDS_IN_HAND) {
      throw 400;
    }

    this.getCardFromHand(playerIndex, rank, suit).isPlayed = true;
  }

  public getCurrentTrick(): any {
    if (!this._currentTrick) {
      throw statuses.NOT_FOUND;
    }

    return this._currentTrick.presentation();
  }

  public startTrick(player: Player, rank: string, suit: string): any {
    // FIXME: check that player has removed enough cards
    if (this.isTrickOpen() || !player.equals(this.getTrickLead())) {
      throw statuses.BAD_REQUEST;
    }

    const playerIndex = this.getPlayersIndex(player);
    const card = this.getCardFromHand(playerIndex, rank, suit);

    // TODO: add support for trump games.
    this._currentTrick = new TrickEntity(card.card, player);
    card.isPlayed = true;
    return this._currentTrick.presentation();
  }

  public addCardToTrick(player: Player, rank: string, suit: string): any {
    if (!this._currentTrick) {
      throw statuses.BAD_REQUEST;
    }

    const playerIndex = this.getPlayersIndex(player);
    if (!playerIndex || !this.hasPlayerTurn(playerIndex)) {
      throw statuses.FORBIDDEN;
    }

    const card = this.getCardFromHand(playerIndex, rank, suit);

    // TODO: check if card has correct suit

    this._currentTrick.playCard(card.card, player);
    card.isPlayed = true;

    if (this._currentTrick.playedCards() === this.PLAYERS) {
      this._handScore.takeTrick(this._currentTrick.getTaker());
    }

    return this._currentTrick.presentation();
  }

  private getPlayersIndex(player: Player): number {
    return this._players.findIndex((x) => player.equals(x));
  }

  private getCardFromHand(playerIndex: number, rank: string, suit: string) {
    const card = this.cardsInPlayersHand(playerIndex).filter((x) =>
      x.card.equals(rank, suit)
    )[0];
    if (!card) {
      throw statuses.NOT_FOUND;
    }
    return card;
  }

  private cardsInPlayersHand(player: number): CardContainer[] {
    return this._cards
      .filter((_val, index) => this.isPlayersCard(player, index))
      .filter((x) => !x.isPlayed);
  }

  private isPlayersCard(player: number, index: number): boolean {
    return Math.trunc((index / this.CARDS_IN_HAND) % this.PLAYERS) === player;
  }

  private isTrickOpen(): boolean {
    if (!this._currentTrick) {
      return false;
    }

    return this._currentTrick.playedCards() < this.PLAYERS;
  }

  private getEldestHand(): Player {
    return this._players[0];
  }

  private getTrickLead(): Player {
    if (this._currentTrick) {
      return this._currentTrick.getTaker();
    }

    return this.getEldestHand();
  }

  private hasPlayerTurn(index: number): boolean {
    const previousPlayerIndex = index - 1 >= 0 ? index - 1 : this.PLAYERS - 1;
    return this._players[previousPlayerIndex].equals(
      this._currentTrick.getLatestPlayer()
    );
  }

  private getTableCards(): CardEntity[] {
    return this._cards.slice(48).map((container) => container.card);
  }
}