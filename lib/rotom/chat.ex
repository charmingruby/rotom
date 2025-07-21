defmodule Rotom.Chat do
  alias Rotom.Accounts.User
  alias Rotom.Chat.Message
  alias Rotom.Chat.Room
  alias Rotom.Repo

  import Ecto.Query

  @pubsub Rotom.PubSub

  def list_rooms do
    Repo.all(from Room, order_by: [asc: :name])
  end

  def get_room!(id) do
    Repo.get!(Room, id)
  end

  def create_room(attrs) do
    %Room{}
    |> Room.changeset(attrs)
    |> Repo.insert()
  end

  def update_room(%Room{} = room, attrs) do
    room
    |> Room.changeset(attrs)
    |> Repo.update()
  end

  def change_room(room, attrs \\ %{}) do
    Room.changeset(room, attrs)
  end

  def list_messages_in_room(%Room{id: id}) do
    Message
    |> where([m], m.room_id == ^id)
    |> order_by([m], asc: :inserted_at, asc: :id)
    |> preload(:user)
    |> Repo.all()
  end

  def change_message(message, attrs \\ %{}) do
    Message.changeset(message, attrs)
  end

  def create_message(user, room, attrs) do
    with {:ok, message} <-
           %Message{user: user, room: room}
           |> Message.changeset(attrs)
           |> Repo.insert() do
      Phoenix.PubSub.broadcast!(@pubsub, topic(room.id), {:new_message, message})

      {:ok, message}
    end
  end

  def delete_message_by_id(id, %User{id: user_id}) do
    message =
      Message
      |> Repo.get_by!(id: id, user_id: user_id)

    Repo.delete(message)

    Phoenix.PubSub.broadcast!(@pubsub, topic(message.room_id), {:message_deleted, message})
  end

  def subscribe_to_room(%Room{} = room) do
    Phoenix.PubSub.subscribe(@pubsub, topic(room.id))
  end

  def unsubscribe_from_room(%Room{} = room) do
    Phoenix.PubSub.unsubscribe(@pubsub, topic(room.id))
  end

  defp topic(room_id), do: "chat_room:#{room_id}"
end
