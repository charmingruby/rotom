defmodule Rotom.Chat.RoomMembership do
  use Ecto.Schema

  import Ecto.Changeset

  alias Rotom.Accounts.User
  alias Rotom.Chat.Room

  schema "room_memberships" do
    belongs_to :user, User
    belongs_to :room, Room

    field :last_read_at, :utc_datetime

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(room_membership, attrs) do
    room_membership
    |> cast(attrs, [])
    |> validate_required([])
  end
end
