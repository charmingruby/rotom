defmodule Rotom.Chat do
  alias Rotom.Chat.Room
  alias Rotom.Repo

  import Ecto.Query

  def list_rooms do
    Repo.all(from Room, order_by: [asc: :name])
  end

  def get_room!(id) do
    Repo.get!(Room, id)
  end
end
