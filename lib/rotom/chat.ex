defmodule Rotom.Chat do
  alias Rotom.Chat.Room
  alias Rotom.Repo

  def list_rooms do
    Repo.all(Room)
  end

  def get_room!(id) do
    Repo.get!(Room, id)
  end
end
