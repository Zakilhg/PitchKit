<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCatalogTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('catalog');
        $this->admin = User::factory()->create(['role' => 'admin', 'first_name' => 'Sam']);
    }

    private function catalog(): array
    {
        $league = League::create(['name' => 'La Liga', 'image' => 'la-liga.png']);
        $brand = Brand::create(['name' => 'Nike', 'image' => 'nike.png']);
        $club = Club::create(['name' => 'FC Barcelona', 'image' => 'barca.png', 'league_id' => $league->id]);

        return [$league, $brand, $club];
    }

    private function jersey(array $overrides = []): Jersey
    {
        [$league, $brand, $club] = $this->catalog();

        return Jersey::create($overrides + [
            'name' => 'FC Barcelona Home Jersey',
            'price' => 89.99,
            'quantity' => 4,
            'image' => 'barca1.jpg',
            'image1' => 'barca2.jpg',
            'image2' => 'barca3.jpg',
            'brand_id' => $brand->id,
            'club_id' => $club->id,
            'league_id' => $league->id,
        ]);
    }

    public function test_the_dashboard_shows_real_catalog_numbers(): void
    {
        $this->jersey(['quantity' => 0]);

        $this->actingAs($this->admin)
            ->get('/')
            ->assertOk()
            ->assertSee('Sam')
            ->assertSeeInOrder(['Jerseys', '1'])
            ->assertSee('Out of stock')
            ->assertSee('FC Barcelona Home Jersey')
            ->assertDontSee('$65,024');
    }

    public function test_an_admin_can_create_a_jersey_with_three_images(): void
    {
        [$league, $brand, $club] = $this->catalog();

        $this->actingAs($this->admin)
            ->post('/jersey', [
                'name' => 'Real Madrid Home Jersey',
                'price' => '89.99',
                'quantity' => '12',
                'brand_id' => $brand->id,
                'club_id' => $club->id,
                'league_id' => $league->id,
                'image' => UploadedFile::fake()->create('front.jpg', 20, 'image/jpeg'),
                'image1' => UploadedFile::fake()->create('back.jpg', 20, 'image/jpeg'),
                'image2' => UploadedFile::fake()->create('detail.jpg', 20, 'image/jpeg'),
            ])
            ->assertRedirect(route('jersey.index'))
            ->assertSessionHas('success');

        $jersey = Jersey::where('name', 'Real Madrid Home Jersey')->firstOrFail();
        $this->assertSame(12, $jersey->quantity);
        foreach ([$jersey->image, $jersey->image1, $jersey->image2] as $file) {
            Storage::disk('catalog')->assertExists($file);
        }
    }

    public function test_creating_a_jersey_shows_errors_next_to_the_fields(): void
    {
        $this->actingAs($this->admin)
            ->from('/jersey/create')
            ->post('/jersey', ['name' => '', 'price' => 'abc'])
            ->assertRedirect('/jersey/create')
            ->assertSessionHasErrors(['name', 'price', 'quantity', 'image']);
    }

    public function test_editing_a_jersey_saves_its_details_and_keeps_its_images(): void
    {
        $jersey = $this->jersey();

        $this->actingAs($this->admin)
            ->get("/jersey/{$jersey->id}/edit")
            ->assertOk()
            ->assertSee('value="FC Barcelona Home Jersey"', false);

        $this->actingAs($this->admin)
            ->put("/jersey/{$jersey->id}", [
                'name' => 'FC Barcelona Away Jersey',
                'price' => '74.50',
                'quantity' => '0',
                'brand_id' => $jersey->brand_id,
                'club_id' => $jersey->club_id,
                'league_id' => $jersey->league_id,
            ])
            ->assertRedirect(route('jersey.index'));

        $jersey->refresh();
        $this->assertSame('FC Barcelona Away Jersey', $jersey->name);
        $this->assertSame('74.50', $jersey->price);
        $this->assertSame(0, $jersey->quantity);
        $this->assertSame('barca1.jpg', $jersey->image);
    }

    public function test_an_admin_can_delete_a_jersey(): void
    {
        $jersey = $this->jersey();

        $this->actingAs($this->admin)
            ->delete("/jersey/{$jersey->id}")
            ->assertRedirect(route('jersey.index'));

        $this->assertModelMissing($jersey);
    }

    public function test_creating_a_club_saves_its_league(): void
    {
        $league = League::create(['name' => 'Serie A', 'image' => 'serie-a.png']);

        $this->actingAs($this->admin)
            ->post('/club', [
                'name' => 'AC Milan',
                'league_id' => $league->id,
                'image' => UploadedFile::fake()->create('milan.png', 10, 'image/png'),
            ])
            ->assertRedirect(route('club.index'));

        $this->assertDatabaseHas('clubs', ['name' => 'AC Milan', 'league_id' => $league->id]);
    }

    public function test_brands_and_leagues_can_be_created_and_renamed(): void
    {
        $this->actingAs($this->admin)
            ->post('/brand', [
                'name' => 'Puma',
                'image' => UploadedFile::fake()->create('puma.png', 10, 'image/png'),
            ])
            ->assertRedirect(route('brand.index'));
        $this->actingAs($this->admin)
            ->post('/league', [
                'name' => 'Ligue 1',
                'image' => UploadedFile::fake()->create('ligue1.png', 10, 'image/png'),
            ])
            ->assertRedirect(route('league.index'));

        $brand = Brand::where('name', 'Puma')->firstOrFail();
        $this->actingAs($this->admin)
            ->put("/brand/{$brand->id}", ['name' => 'PUMA'])
            ->assertRedirect(route('brand.index'));

        $this->assertSame('PUMA', $brand->refresh()->name);
        $this->assertDatabaseHas('leagues', ['name' => 'Ligue 1']);
    }

    public function test_a_brand_with_jerseys_cannot_be_deleted(): void
    {
        $jersey = $this->jersey();

        $this->actingAs($this->admin)
            ->from('/brand')
            ->delete("/brand/{$jersey->brand_id}")
            ->assertRedirect('/brand')
            ->assertSessionHas('error');

        $this->assertDatabaseHas('brands', ['id' => $jersey->brand_id]);
    }

    public function test_logging_out_needs_a_post_request(): void
    {
        $this->actingAs($this->admin)->post('/logout')->assertRedirect(route('auth.login'));

        $this->assertGuest();
    }

    public function test_every_admin_list_page_renders(): void
    {
        $this->jersey();

        foreach (['/jersey', '/jersey/create', '/brand', '/brand/create', '/league', '/league/create', '/club', '/club/create'] as $url) {
            $this->actingAs($this->admin)->get($url)->assertOk();
        }
    }
}
