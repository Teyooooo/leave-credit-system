<script lang="ts">
 import { browser } from '$app/environment';
 import MonitorCog from "@lucide/svelte/icons/monitor-cog";
 import MoonIcon from "@lucide/svelte/icons/moon";
 import Palette from "@lucide/svelte/icons/palette";
 import SunIcon from "@lucide/svelte/icons/sun";
 
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
 import { resetMode, setMode } from "mode-watcher";
</script>

{#if browser}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="w-full flex items-center gap-2">
      <Palette class="h-4 w-4" />
      <span>Toggle Mode</span>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content align="start" class="w-50">
      <DropdownMenu.Item onclick={() => setMode("light")}>
        <SunIcon class="h-4 w-4 mr-2" /> Light
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => setMode("dark")}>
        <MoonIcon class="h-4 w-4 mr-2" /> Dark
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => resetMode()}>
        <MonitorCog class="h-4 w-4 mr-2" /> System
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}