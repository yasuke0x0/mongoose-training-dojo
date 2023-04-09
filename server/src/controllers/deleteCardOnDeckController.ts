import {Request, Response} from "express";
import Deck from "../models/Deck";

export async function deleteCardOnDeckController(req: Request, res: Response) {
    const {deckId, index} = req.params
    const deck = await Deck.findById(deckId)
    if (!deck) return res.status(400).send("no deck of this id exists");
    deck.cards.splice(parseInt(index), 1);
    await deck.save();
    res.json(deck);
}