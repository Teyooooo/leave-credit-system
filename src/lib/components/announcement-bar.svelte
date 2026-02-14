<script lang="ts">
	import { Megaphone } from "@lucide/svelte";
	import * as Alert from "./ui/alert";
	import * as Carousel from "./ui/carousel";
	import type { AnnouncementInfo } from "$lib/types/data";
	import Autoplay from 'embla-carousel-autoplay';

    let { announcements } : { announcements: AnnouncementInfo[] }  = $props()

    const plugin = Autoplay({ delay: 30000, stopOnInteraction: true });

</script>

<Carousel.Root class="w-full p-2" plugins={[plugin]}>
  <Carousel.Content>
      {#each announcements as item}
      <Carousel.Item>
             <Alert.Root class="flex gap-3 items-center py-2 bg-sidebar-primary/5">
                 <div>
                     <Megaphone />
                    </div>
                    <div class="ps-5 border-s-3 border-sidebar-primary">
                        <Alert.Title>{item.title}</Alert.Title>
                        <Alert.Description>
                            {item.details}
                        </Alert.Description>
                    </div> 
                </Alert.Root>
            </Carousel.Item>
            {/each}
  </Carousel.Content>
</Carousel.Root>